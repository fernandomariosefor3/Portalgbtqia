/**
 * Firebase Publisher - Publica eventos no Firestore
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { ProcessedEvent, PublishResult, AgentReport } from '../types.js';

export class FirebasePublisher {
  private db: ReturnType<typeof getFirestore>;
  private eventsLimit: number;
  private publishedCount: number = 0;
  private errors: string[] = [];

  constructor(eventsLimitPerWeek: number = 10) {
    this.eventsLimit = eventsLimitPerWeek;
    this.db = this.initializeFirebase();
  }

  private initializeFirebase(): ReturnType<typeof getFirestore> {
    // Inicializa Firebase Admin SDK
    if (getApps().length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      // Garante que \n literais viram quebras de linha reais
      const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
      const privateKey = rawKey.includes('\\n')
        ? rawKey.replace(/\\n/g, '\n')
        : rawKey;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Variáveis de ambiente do Firebase não configuradas');
      }

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    const db = getFirestore();
    // Muitos campos opcionais (address, imageUrl, endDate...) ficam undefined
    // dependendo da fonte do scraper; o Firestore rejeita undefined por padrão.
    db.settings({ ignoreUndefinedProperties: true });
    return db;
  }

  async publishEvents(events: ProcessedEvent[]): Promise<PublishResult[]> {
    const results: PublishResult[] = [];

    console.log(`\n🚀 Iniciando publicação de ${Math.min(events.length, this.eventsLimit)} eventos...`);

    // Limita eventos por semana
    const eventsToPublish = events.slice(0, this.eventsLimit);

    for (const event of eventsToPublish) {
      try {
        const result = await this.publishEvent(event);
        results.push(result);

        if (result.success) {
          this.publishedCount++;
          console.log(`✅ Publicado: "${event.title.substring(0, 40)}..."`);
        } else {
          console.error(`❌ Erro: "${event.title.substring(0, 40)}..." - ${result.error}`);
          this.errors.push(result.error || 'Unknown error');
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Exceção: "${event.title.substring(0, 40)}..." - ${errorMsg}`);
        results.push({
          success: false,
          slug: event.slug,
          error: errorMsg,
        });
        this.errors.push(errorMsg);
      }
    }

    console.log(`\n📊 Publicados: ${this.publishedCount}/${eventsToPublish.length} eventos`);

    return results;
  }

  /**
   * O frontend (src/lib/firestore.ts) le e ordena eventos por campos em
   * snake_case (start_date, image_url, short_description...), enquanto o
   * agente trabalha internamente em camelCase (ProcessedEvent). Sem esse
   * mapeamento, os documentos gravados ficam invisiveis para a UI: o
   * orderBy('start_date') do frontend exclui qualquer doc que nao tenha
   * exatamente esse campo.
   */
  private toFirestoreFields(event: ProcessedEvent): Record<string, unknown> {
    return {
      title: event.title,
      slug: event.slug,
      description: event.description,
      short_description: event.shortDescription,
      category: event.category,
      location: event.location,
      address: event.address,
      city: event.city,
      state: event.state,
      start_date: event.startDate,
      end_date: event.endDate,
      start_time: event.startTime,
      end_time: event.endTime,
      image_url: event.imageUrl,
      source_url: event.sourceUrl,
      status: event.status,
      organizer: event.organizer,
      contact_email: event.contactEmail,
      contact_phone: event.contactPhone,
      price_info: event.priceInfo,
      tags: event.tags,
      source: event.source,
    };
  }

  private async publishEvent(event: ProcessedEvent): Promise<PublishResult> {
    try {
      // Verifica se evento já existe (por slug)
      const existingQuery = await this.db
        .collection('events')
        .where('slug', '==', event.slug)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        return {
          success: false,
          slug: event.slug,
          error: 'Evento já existe',
        };
      }

      // Adiciona evento
      const eventRef = await this.db.collection('events').add({
        ...this.toFirestoreFields(event),
        createdAt: FieldValue.serverTimestamp(),
        publishedBy: 'agent',
      });

      // Adiciona à collection de logs
      await this.db.collection('agentLogs').add({
        eventId: eventRef.id,
        slug: event.slug,
        title: event.title,
        source: event.source,
        publishedAt: FieldValue.serverTimestamp(),
        action: 'published',
      });

      return {
        success: true,
        eventId: eventRef.id,
        slug: event.slug,
      };
    } catch (error) {
      return {
        success: false,
        slug: event.slug,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getRecentPublications(): Promise<Record<string, unknown>[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Query de campo único para evitar exigência de índice composto no Firestore.
    // O filtro por data é feito em memória (coleção pequena, publicada só pelo agente).
    const snapshot = await this.db
      .collection('events')
      .where('publishedBy', '==', 'agent')
      .get();

    return snapshot.docs
      .map((doc) => doc.data() as Record<string, unknown> & { createdAt?: { toDate(): Date } })
      .filter((event) => {
        const createdAt = event.createdAt;
        if (!createdAt || typeof createdAt.toDate !== 'function') return false;
        return createdAt.toDate() >= weekAgo;
      });
  }

  async getPublishedCountThisWeek(): Promise<number> {
    const publications = await this.getRecentPublications();
    return publications.length;
  }

  async logRun(report: AgentReport): Promise<void> {
    await this.db.collection('agentReports').add({
      ...report,
      createdAt: FieldValue.serverTimestamp(),
    });

    console.log('\n📝 Relatório salvo no Firebase');
  }

  getReport(): AgentReport {
    return {
      runDate: new Date().toISOString(),
      eventsFound: 0, // Será preenchido pelo orchestrator
      eventsProcessed: 0,
      eventsPublished: this.publishedCount,
      errors: this.errors,
      sources: [],
    };
  }
}
