# RippleAI

**AI search and Q&A for construction project documents.**

A construction project lives in thousands of pages: drawing sets, specifications, schedules, RFIs, submittals, meeting minutes. Finding the one detail you need means flipping through sheets and binders. RippleAI lets a project team upload those documents once and then ask questions in plain English, getting answers grounded in, and cited back to, the source documents.

> *"What's the fire rating on the level 3 corridor walls?"*
> *"Which RFIs are still open on the mechanical package?"*
> *"When is the curtain wall install scheduled to start?"*

## How it works

RippleAI is a retrieval-augmented generation (RAG) system:

1. **Ingest.** Documents are parsed, split into chunks and embedded. Scanned and layout-heavy files (drawings, specs, schedules) go through document-parsing services built for PDFs and tables; recordings of site meetings can be transcribed.
2. **Index.** Chunks and their embeddings are stored in a Weaviate vector database, with one isolated document space per customer.
3. **Retrieve.** Each question runs hybrid search (keyword plus semantic) over the project's documents to pull the most relevant passages.
4. **Answer.** An LLM writes the answer from those passages only, and the source chunks are shown alongside it so every answer can be checked.

## Features

- **Chat over project documents**, with the supporting passages shown for every answer.
- **Construction-ready ingestion.** PDFs, drawings, spreadsheets and Word files via Unstructured and Upstage Document Parse; meeting audio via AssemblyAI; plus plain text, Markdown and HTML.
- **Multi-user accounts.** Email and password login, with passwords hashed using bcrypt.
- **Role-based access**, so each person on a project sees only what their role allows:

  | Role | Can do |
  |---|---|
  | `BasicUser` | Chat with the project's documents |
  | `BasicUploadUser` | Chat, and upload and browse documents |
  | `Admin` | All of the above, plus manage users for their organisation |
  | `RippleAdmin` | Full control: ingestion pipeline, model and chat configuration, customer settings, all users |

- **Admin console** at `/admin` for creating users and assigning roles.
- **Per-customer configuration**, so each organisation connects to its own Weaviate instance.
- **Choice of models**: OpenAI, Anthropic, Cohere, Groq, Upstage and Novita, or local models through Ollama.

## Getting started

Requires Python 3.10+ and a Weaviate instance (Weaviate Cloud or self-hosted).

```bash
git clone https://github.com/VaishnavGarodia/rippleAI.git
cd rippleAI
pip install -e .
```

Copy `goldenverba/.env.example` to `.env` and fill in your keys: the LLM and embedding providers you plan to use, the document-parsing services, and `ADMIN_PASSWORD` for the admin console.

Start the server:

```bash
verba start
```

Then open `http://localhost:8000`, sign in, and create users from `/admin`.

To run with Docker instead:

```bash
docker compose up -d
```

## Project layout

| Path | What it holds |
|---|---|
| `goldenverba/server/` | FastAPI backend: API, authentication, admin console |
| `goldenverba/components/` | Ingestion pipeline: readers, chunkers, embedders, retrievers, generators |
| `frontend/` | Next.js web app: chat, document explorer, ingestion, settings |

## Roadmap

- **Drawing-aware ingestion**: read sheet numbers, title blocks and revisions so answers cite the exact sheet.
- **Schedule parsing**: turn project schedules into structured data for date and dependency questions.
- **Automatic ingestion settings** chosen by document type.
- **Document-level permissions**, so access can be restricted per document or discipline.
- **Usage metrics** in the admin console.

## Acknowledgements

RippleAI is built on [Verba](https://github.com/weaviate/Verba), Weaviate's open-source RAG application, which provides the core ingestion, retrieval and chat engine. The Python package and CLI keep Verba's names (`goldenverba`, `verba`). Verba is released under the BSD 3-Clause License; see [LICENSE](LICENSE).
