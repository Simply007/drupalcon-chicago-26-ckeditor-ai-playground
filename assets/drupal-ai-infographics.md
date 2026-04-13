# Drupal AI Ecosystem - Visualizations & Glossary

This document provides comprehensive visualizations and terminology definitions for the Drupal AI module ecosystem. It includes both conceptual overviews for general understanding and technical diagrams with code references.

---

## Table of Contents

1. [Conceptual Diagrams](#conceptual-diagrams)
   - [Architecture Overview](#1-architecture-overview-conceptual)
   - [Agent Workflow](#2-agent-workflow-conceptual)
   - [Capabilities Mind Map](#3-capabilities-mind-map)
2. [Technical Diagrams](#technical-diagrams)
   - [Architecture Detailed](#4-architecture-detailed-technical)
   - [Agent Loop Sequence](#5-agent-loop-sequence-technical)
   - [Entity Relationships](#6-entity-relationships)
   - [Orchestration Pattern](#7-orchestration-pattern)
3. [Your Configuration](#your-specific-configuration)
   - [Provider Mapping](#8-your-provider-mapping)
   - [Capability Matrix](#capability-matrix)
4. [Complete Ecosystem](#9-complete-ecosystem-overview)
5. [Glossary](#glossary)
   - [AI Core Terms](#ai-core-terms)
   - [Drupal AI Entities](#drupal-ai-entities)
   - [Operation Types](#operation-types-capabilities)

---

# Conceptual Diagrams

## 1. Architecture Overview (Conceptual)

A simplified view of how Drupal AI is structured in layers:

```mermaid
flowchart TB
    subgraph UI["User Interface Layer"]
        Chatbot["AI Chatbot"]
        CKEditor["CKEditor Integration"]
        Search["AI Search"]
        Dashboard["AI Dashboard"]
    end

    subgraph Consumer["Consumer Modules"]
        Agents["AI Agents"]
        Automators["AI Automators"]
        Assistant["AI Assistant API"]
        Translate["AI Translate"]
    end

    subgraph Capabilities["Operation Types / Capabilities"]
        Chat["Chat"]
        Embeddings["Embeddings"]
        TTI["Text-to-Image"]
        TTS["Text-to-Speech"]
        STT["Speech-to-Text"]
        Moderation["Moderation"]
    end

    subgraph Providers["AI Provider Layer"]
        Anthropic["Anthropic"]
        OpenAI["OpenAI"]
        AWS["AWS Bedrock"]
        Ollama["Ollama"]
        Other["Other Providers..."]
    end

    UI --> Consumer
    Consumer --> Capabilities
    Capabilities --> Providers
```

**Description:** This diagram shows the four main layers of Drupal AI:
1. **UI Layer** - User-facing components (chatbots, editor integrations)
2. **Consumer Modules** - Modules that use AI capabilities (agents, automators)
3. **Capabilities** - The types of AI operations available
4. **Providers** - External AI services that power the capabilities

---

## 2. Agent Workflow (Conceptual)

How an AI Agent processes a request:

```mermaid
flowchart TD
    Start([User Request]) --> Prepare["Prepare Context"]
    Prepare --> |"System Prompt + Instructions + Tools + Memory"| LLM["Send to LLM"]
    LLM --> Decision{LLM Decision}
    Decision --> |"Use a Tool"| Execute["Execute Tool"]
    Execute --> Memory["Store Result in Memory"]
    Memory --> LLM
    Decision --> |"Send Response"| Response([Return to User])

    style Start fill:#e1f5fe
    style Response fill:#c8e6c9
    style Decision fill:#fff3e0
```

**Description:** The Agent Loop:
1. User sends a request
2. System prepares context (prompts, available tools, conversation history)
3. LLM decides: use a tool OR respond
4. If tool: execute it, store result, loop back to LLM
5. If response: return to user

---

## 3. Capabilities Mind Map

All AI operation types available in Drupal AI:

```mermaid
mindmap
  root((Drupal AI<br>Capabilities))
    Chat
      Basic Chat
      Complex JSON
      Image Vision
      Structured Response
      Tools/Function Calling
    Generation
      Text-to-Image
      Text-to-Speech
      Image-to-Image
    Transcription
      Speech-to-Text
      Audio-to-Audio
    Analysis
      Embeddings
      Moderation
      Image Classification
      Object Detection
    Translation
      Text Translation
```

**Description:** Drupal AI supports multiple capability categories:
- **Chat** - Conversational AI with various enhancements
- **Generation** - Creating media from text
- **Transcription** - Converting audio to text
- **Analysis** - Understanding and classifying content
- **Translation** - Language conversion

---

# Technical Diagrams

## 4. Architecture Detailed (Technical)

Full architecture with service classes and plugin managers:

```mermaid
flowchart TB
    subgraph UI["UI / Integration Layer"]
        direction LR
        DeepChat["DeepChat Block<br><small>ai_chatbot module</small>"]
        CK5["CKEditor 5 Plugin<br><small>ai_ckeditor module</small>"]
        AISearch["Search Integration<br><small>ai_search module</small>"]
    end

    subgraph Consumer["Consumer Layer"]
        direction TB
        subgraph AgentSystem["AI Agents System"]
            AgentRunner["AiAgentRunner<br><small>Service</small>"]
            AgentPlugin["AiAgentPluginManager<br><small>Plugin Manager</small>"]
            FunctionCall["FunctionCallPluginManager<br><small>Tool Execution</small>"]
        end

        subgraph AutomatorSystem["AI Automators"]
            AutomatorProcessor["AutomatorFieldProcessor<br><small>Service</small>"]
            FieldRules["AiFieldRules<br><small>Rule Engine</small>"]
        end

        subgraph AssistantSystem["AI Assistant API"]
            AssistantRunner["AiAssistantApiRunner<br><small>Service</small>"]
            MessageBuilder["AssistantMessageBuilder<br><small>Context Builder</small>"]
            ActionPlugin["AiAssistantActionPluginManager"]
        end
    end

    subgraph Core["AI Core Module"]
        direction TB
        ProviderManager["AiProviderPluginManager<br><small>Provider Discovery</small>"]
        ProviderProxy["ProviderProxy<br><small>Request/Response Wrapper</small>"]
        OperationTypes["OperationType/*<br><small>Capability Definitions</small>"]

        subgraph DTOs["Data Transfer Objects"]
            ChatInput["ChatInput"]
            ChatOutput["ChatOutput"]
            EmbeddingInput["EmbeddingInput"]
        end
    end

    subgraph Providers["Provider Plugins"]
        direction LR
        AnthropicPlugin["#[AiProvider]<br>Anthropic"]
        OpenAIPlugin["#[AiProvider]<br>OpenAI"]
        BedrockPlugin["#[AiProvider]<br>AWS Bedrock"]
        OllamaPlugin["#[AiProvider]<br>Ollama"]
    end

    UI --> Consumer
    Consumer --> Core
    Core --> ProviderProxy
    ProviderProxy --> Providers

    ProviderManager -.->|discovers| Providers
```

**Key Files:**
- Provider Manager: `web/modules/contrib/ai/src/AiProviderPluginManager.php`
- Agent Runner: `web/modules/contrib/ai_agents/src/Service/AiAgentRunner.php`
- Function Calling: `web/modules/contrib/ai/src/Service/FunctionCalling/`
- Operation Types: `web/modules/contrib/ai/src/OperationType/`

---

## 5. Agent Loop Sequence (Technical)

Detailed sequence showing the agent execution loop with classes:

```mermaid
sequenceDiagram
    participant User
    participant Runner as AiAgentRunner
    participant Memory as ShortTermMemory
    participant Provider as ProviderProxy
    participant LLM as External LLM
    participant FuncCall as FunctionCallPlugin

    User->>Runner: execute(agent, prompt)
    Runner->>Memory: initializeMemory()

    loop Agent Loop (max_loops)
        Runner->>Memory: getContext()
        Memory-->>Runner: system_prompt + history + tools
        Runner->>Provider: chat(input)
        Provider->>LLM: API Request
        LLM-->>Provider: Response
        Provider-->>Runner: ChatOutput

        alt Tool Call Requested
            Runner->>FuncCall: execute(toolName, params)
            FuncCall-->>Runner: Tool Result
            Runner->>Memory: addToolResult(result)
        else Text Response
            Runner-->>User: Final Response
        end
    end
```

**Key Classes:**
- `AiAgentRunner` - Orchestrates the loop
- `AiShortTermMemoryPluginManager` - Manages conversation context
- `ProviderProxy` - Wraps provider calls with events/logging
- `ExecutableFunctionCallInterface` - Tool execution contract

---

## 6. Entity Relationships

Drupal configuration entities in the AI ecosystem:

```mermaid
erDiagram
    AI_PROVIDER ||--o{ OPERATION_TYPE : "supports"
    AI_PROVIDER {
        string id PK
        string label
        string plugin_id
        array configuration
    }

    OPERATION_TYPE {
        string id PK
        string label
        string provider_id FK
        string model_id
    }

    AI_AGENT ||--|{ FUNCTION_CALL : "uses"
    AI_AGENT {
        string id PK
        string label
        text system_prompt
        text secured_system_prompt
        array tools
        int max_loops
        boolean orchestration_agent
    }

    AI_ASSISTANT ||--o{ AI_ASSISTANT_ACTION : "triggers"
    AI_ASSISTANT {
        string id PK
        string label
        text system_prompt
        text pre_action_prompt
        array enabled_actions
    }

    AI_PROMPT {
        string id PK
        string label
        string type
        text prompt
    }

    AI_AUTOMATOR_RULE ||--|| FIELD_CONFIG : "applies to"
    AI_AUTOMATOR_RULE {
        string id PK
        string entity_type
        string bundle
        string field_name
        string automator_type
        text prompt_template
    }

    FUNCTION_CALL {
        string id PK
        string label
        string group
        array parameters
    }

    AI_ASSISTANT_ACTION {
        string id PK
        string label
        string plugin_id
    }
```

**Entity Locations:**
- AI Provider: Plugin-based (not config entity)
- AI Agent: `web/modules/contrib/ai_agents/src/Entity/AiAgent.php`
- AI Prompt: `web/modules/contrib/ai/src/Entity/AiPrompt.php`
- AI Assistant: `web/modules/contrib/ai/modules/ai_assistant_api/`

---

## 7. Orchestration Pattern

Multi-agent hierarchy (centralized orchestration):

```mermaid
flowchart TB
    subgraph Orchestrator["Orchestrator Agent"]
        Main["Drupal CMS Assistant<br><small>Decides which agent to call</small>"]
    end

    subgraph SubAgents["Specialized Sub-Agents"]
        ContentType["Content Type Agent<br><small>Creates/modifies content types</small>"]
        Field["Field Agent<br><small>Manages field configuration</small>"]
        Taxonomy["Taxonomy Agent<br><small>Manages vocabularies/terms</small>"]
        Views["Views Agent<br><small>Creates/modifies views</small>"]
        Webform["Webform Agent<br><small>Creates forms</small>"]
    end

    subgraph Tools["Function Call Tools"]
        CreateCT["create_content_type()"]
        AddField["add_field()"]
        CreateVocab["create_vocabulary()"]
        CreateView["create_view()"]
    end

    User([User Request]) --> Main
    Main -->|"Step 1: Create content type"| ContentType
    Main -->|"Step 2: Add fields"| Field
    Main -->|"Step 3: Create taxonomy"| Taxonomy

    ContentType --> CreateCT
    Field --> AddField
    Taxonomy --> CreateVocab

    ContentType -->|"Result"| Main
    Field -->|"Result"| Main
    Taxonomy -->|"Result"| Main

    Main --> Response([Final Response])
```

**Description:** Orchestration allows a parent agent to:
1. Analyze the user's complex request
2. Break it into smaller tasks
3. Delegate to specialized sub-agents
4. Collect results and provide unified response

---

# Your Specific Configuration

## 8. Your Provider Mapping

Your current Drupal AI setup with Anthropic and OpenAI:

```mermaid
flowchart LR
    subgraph YourConfig["Your Drupal AI Configuration"]
        direction TB

        subgraph Anthropic["Anthropic Provider"]
            Claude["Claude Sonnet 4.6"]
        end

        subgraph OpenAI["OpenAI Provider"]
            Whisper["whisper-1"]
            DALLE["dall-e-3"]
            OmniMod["omni-moderation-latest"]
        end
    end

    subgraph Capabilities["Assigned Capabilities"]
        Chat["Chat"]
        ChatJSON["Chat + Complex JSON"]
        ChatVision["Chat + Image Vision"]
        ChatStruct["Chat + Structured Response"]
        ChatTools["Chat + Tools/Function Calling"]

        Mod["Moderation"]
        STT["Speech-to-Text"]
        TTI["Text-to-Image"]
        TTS["Text-to-Speech"]
    end

    Claude --> Chat
    Claude --> ChatJSON
    Claude --> ChatVision
    Claude --> ChatStruct
    Claude --> ChatTools

    OmniMod --> Mod
    Whisper --> STT
    DALLE --> TTI
    OpenAI --> TTS

    style Anthropic fill:#d4e6f1
    style OpenAI fill:#d5f5e3
```

## Capability Matrix

| Capability | Provider | Model |
|------------|----------|-------|
| Chat | Anthropic | Claude Sonnet 4.6 |
| Chat with Complex JSON | Anthropic | Claude Sonnet 4.6 |
| Chat with Image Vision | Anthropic | Claude Sonnet 4.6 |
| Chat with Structured Response | Anthropic | Claude Sonnet 4.6 |
| Chat with Tools/Function Calling | Anthropic | Claude Sonnet 4.6 |
| Moderation | OpenAI | omni-moderation-latest |
| Speech to Text | OpenAI | whisper-1 |
| Text to Image | OpenAI | dall-e-3 |
| Text to Speech | OpenAI | *(configured)* |

---

## 9. Complete Ecosystem Overview

Everything combined in one diagram:

```mermaid
flowchart TB
    subgraph External["External AI Services"]
        Anthropic["Anthropic<br>Claude Sonnet 4.6"]
        OpenAI["OpenAI<br>GPT/DALL-E/Whisper"]
    end

    subgraph Providers["AI Provider Plugins"]
        ProviderManager["AiProviderPluginManager"]
        ProviderProxy["ProviderProxy<br><small>Events, Logging, Moderation</small>"]
    end

    subgraph Operations["Operation Types"]
        direction LR
        Chat["Chat"]
        Embed["Embeddings"]
        TTI["Text-to-Image"]
        TTS["Text-to-Speech"]
        STT["Speech-to-Text"]
        Mod["Moderation"]
    end

    subgraph Consumers["AI Consumer Modules"]
        subgraph AgentsBox["AI Agents"]
            Agent["AI Agent"]
            FuncCall["Function Calls"]
            Memory["Short-term Memory"]
        end

        subgraph AutoBox["AI Automators"]
            Rules["Field Rules"]
            Processors["Field Processors"]
        end

        subgraph AssistBox["AI Assistant"]
            Assistant["AI Assistant"]
            Actions["Assistant Actions"]
        end

        Prompts["AI Prompts"]
    end

    subgraph Integration["Integration & UI"]
        Chatbot["AI Chatbot"]
        CKEditor["CKEditor AI"]
        Search["AI Search"]
        ECA["AI ECA"]
        Translate["AI Translate"]
    end

    subgraph Drupal["Drupal Core"]
        Entities["Content Entities"]
        Fields["Fields"]
        Config["Configuration"]
    end

    External <--> Providers
    Providers <--> Operations
    Operations <--> Consumers
    Consumers <--> Integration
    Integration <--> Drupal
    Consumers <--> Drupal
```

---

# Glossary

## AI Core Terms

| Term | Definition |
|------|------------|
| **AI** | Artificial Intelligence - Computer systems that perform tasks typically requiring human intelligence (learning, reasoning, problem-solving) |
| **LLM** | Large Language Model - An AI model trained on vast amounts of text data to understand and generate human-like language. Examples: GPT-4, Claude, Llama |
| **Model** | A specific trained version of an AI system. Example: "Claude Sonnet 4.6" is a model from Anthropic |
| **MCP** | Model Context Protocol - A standardized protocol for connecting AI models to external tools and data sources |
| **Tool** | A piece of code or external service that an LLM can request to execute. Also called "function calling" |
| **Embedding** | A numerical vector representation of text that captures semantic meaning. Used for similarity search and RAG |
| **Agent** | An autonomous AI system that can use tools, maintain memory, and make decisions to accomplish tasks. Per Anthropic: "Systems where LLMs dynamically direct their own processes and tool usage" |
| **RAG** | Retrieval-Augmented Generation - Technique of fetching relevant documents before generating responses to ground the AI in factual data |
| **Token** | The basic unit of text processing for LLMs. Roughly 4 characters or 3/4 of a word in English |
| **Context Window** | The maximum amount of text (in tokens) an LLM can process in a single request |
| **System Prompt** | Instructions provided to the LLM that define its behavior, personality, and constraints |
| **Function Calling** | The ability for an LLM to request execution of predefined functions/tools and receive their results |

## Drupal AI Entities

| Entity | Type | Description |
|--------|------|-------------|
| **AI Provider** | Plugin | Connects Drupal to external AI services. Implements `AiProviderInterface`. Discovered via `#[AiProvider]` attribute |
| **AI Agent** | Config Entity | An autonomous entity with a system prompt, available tools, and execution loop. Can call other agents (orchestration) |
| **AI Chat** | Interface | Real-time conversational interaction with an LLM. Implemented through Chat operation type |
| **AI Assistant** | Config Entity | A configured chatbot instance with specific prompts, enabled actions, and conversation settings |
| **AI Automator** | Config Entity | Rule-based automation that generates field values using AI when content is created/updated |
| **AI Prompt** | Config Entity | Reusable prompt template with variable substitution. Can be bundled by type |
| **Function Call** | Plugin | A tool that agents can execute. Defined with `#[FunctionCall]` attribute, implements `ExecutableFunctionCallInterface` |
| **AI Assistant Action** | Plugin | Actions that the Assistant API can trigger based on LLM decisions |
| **Operation Type** | Interface | Defines a specific AI capability (Chat, Embeddings, etc.) with input/output DTOs |

## Operation Types (Capabilities)

| Capability | Description | Use Cases |
|------------|-------------|-----------|
| **Chat** | Basic conversational AI | Q&A, content generation, summarization |
| **Chat with Complex JSON** | Chat that returns structured JSON | API responses, structured data extraction |
| **Chat with Image Vision** | Chat that can analyze images | Image description, visual Q&A, OCR |
| **Chat with Structured Response** | Chat with schema-validated output | Form filling, typed responses |
| **Chat with Tools/Function Calling** | Chat that can execute tools | Agents, automated workflows, data retrieval |
| **Moderation** | Content safety analysis | Harmful content detection, policy compliance |
| **Speech to Text** | Audio transcription | Meeting notes, podcast transcription |
| **Text to Speech** | Audio generation from text | Accessibility, voice content |
| **Text to Image** | Image generation from prompts | Illustrations, thumbnails, creative content |
| **Embeddings** | Vector representation of text | Semantic search, similarity matching, RAG |
| **Image Classification** | Categorizing images | Auto-tagging, content organization |
| **Object Detection** | Identifying objects in images | Image analysis, accessibility |
| **Text Translation** | Language conversion | Multilingual content |

---

## Reference Links

### Official Documentation
- Drupal AI Module: https://project.pages.drupalcode.org/ai/
- AI Agents: https://www.drupal.org/project/ai_agents

### Key Files in Your Installation
```
web/modules/contrib/ai/
├── src/
│   ├── AiProviderPluginManager.php    # Provider discovery
│   ├── AiProviderInterface.php        # Provider contract
│   ├── OperationType/                 # Capability definitions
│   │   ├── Chat/
│   │   ├── Embeddings/
│   │   └── ...
│   ├── Entity/
│   │   └── AiPrompt.php              # Prompt entity
│   └── Service/
│       └── FunctionCalling/          # Tool execution
│
├── modules/
│   ├── ai_assistant_api/             # Assistant/Chatbot
│   ├── ai_automators/                # Field automation
│   ├── ai_chatbot/                   # DeepChat UI
│   └── ai_search/                    # Search integration
│
└── docs/                             # MkDocs documentation

web/modules/contrib/ai_agents/
├── src/
│   ├── Entity/AiAgent.php            # Agent config entity
│   └── Service/AiAgentRunner.php     # Agent execution
└── docs/                             # Agent documentation
```

---

*Generated for Drupal AI ecosystem documentation. Last updated: April 2026*
