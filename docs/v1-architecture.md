# Aetheris Studio v1 Architecture Blueprint

## High-Level Architecture

```text
Web UI (React/Next)
  -> API Gateway
     -> Auth Service
     -> Project Service
     -> Dataset Service
     -> Training Orchestrator
     -> Experiment Service
     -> Model Registry Service
     -> Deployment Service
     -> Notification Service

Training Workers (Kubernetes Jobs)
  -> Metrics Emitter SDK
  -> Artifact Writer

Metrics Pipeline
  Metrics Stream (Kafka/PubSub)
    -> Stream Aggregator
      -> WebSocket Gateway
        -> Live Dashboard

Storage
- Object Store: datasets, checkpoints, model artifacts
- Postgres: metadata, projects, runs, permissions
- Time-Series DB: high-frequency metrics
- Redis: caching/session and short-lived run state
```

## Service Responsibilities

### Dataset Service
- ingestion orchestration
- schema inference and validation
- dataset versioning and lineage

### Training Orchestrator
- translates UI config into reproducible job spec
- schedules jobs on GPU/CPU pools
- handles pause/resume/cancel
- checkpoint policy enforcement

### Experiment Service
- stores run configs + metric references
- comparison queries and ranking

### Model Registry
- model version states (staging/production/archived)
- artifact signatures and provenance

## Communication Patterns
- External: REST for control operations
- Internal: gRPC for service-to-service commands
- Realtime: WebSocket for dashboard streaming
- Async workflows: queue/event bus

## Scalability Plan
- Horizontal autoscale API services
- Separate worker node pools by accelerator class
- Partition metric streams by run_id
- Backpressure-aware stream aggregation

## Failure Handling
- Idempotent job submission (client idempotency keys)
- Exponential retry for transient worker failures
- Auto-resume from latest valid checkpoint
- Circuit breakers between core services

## Latency Targets
- Dataset validation response: < 10s for metadata/profile
- Run launch confirmation: < 5s
- Live metric propagation p95: < 3s

