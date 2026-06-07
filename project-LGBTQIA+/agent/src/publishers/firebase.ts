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

    return getFirestore();
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
        ...event,
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

  async getRecentPublications(): Promise<ProcessedEvent[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const snapshot = await this.db
      .collection('events')
      .where('publishedBy', '==', 'agent')
      .where('publishedAt', '>=', weekAgo)
      .get();

    return snapshot.docs.map((doc) => doc.data() as ProcessedEvent);
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
