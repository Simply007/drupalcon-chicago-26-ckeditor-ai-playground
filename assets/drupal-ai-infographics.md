# Drupal AI Ecosystem - Visualizations & Glossary

This document provides comprehensive visualizations and terminology definitions for the Drupal AI module ecosystem. It includes both conceptual overviews for general understanding and technical diagrams with code references.

---

## Table of Contents

1. [Drupal AI Entities Explained](#drupal-ai-entities-explained)
   - [Entity Relationship Diagram](#entity-relationship-diagram)
   - [Entity Definitions](#entity-definitions-summary)
   - [AI Prompt Use Cases](#ai-prompt-use-cases)
2. [Conceptual Diagrams](#conceptual-diagrams)
   - [Architecture Overview](#1-architecture-overview-conceptual)
   - [Agent Workflow](#2-agent-workflow-conceptual)
   - [Capabilities Mind Map](#3-capabilities-mind-map)
3. [Technical Diagrams](#technical-diagrams)
   - [Architecture Detailed](#4-architecture-detailed-technical)
   - [Agent Loop Sequence](#5-agent-loop-sequence-technical)
   - [Entity Relationships](#6-entity-relationships)
   - [Orchestration Pattern](#7-orchestration-pattern)
4. [Your Configuration](#your-specific-configuration)
   - [Provider Mapping](#8-your-provider-mapping)
   - [Capability Matrix](#capability-matrix)
5. [Complete Ecosystem](#9-complete-ecosystem-overview)
6. [Glossary](#glossary)
   - [AI Core Terms](#ai-core-terms)
   - [Drupal AI Entities](#drupal-ai-entities)
   - [Operation Types](#operation-types-capabilities)

---

# Drupal AI Entities Explained

This section provides a focused overview of the core Drupal AI entities and how they work together. Understanding these relationships is key to leveraging the full power of Drupal's AI ecosystem.

## Drupal AI Entities Overview

```mermaid
flowchart LR
    subgraph Legend[Drupal AI Entities]
        direction TB
        L_Provider[AI Provider<br>Wraps LLM communication]
        L_Prompt[AI Prompt<br>Reusable templates]
        L_Tool[AI Tool<br>Executable actions]
        L_Agent[AI Agent<br>Autonomous task executor]
        L_Assistant[AI Assistant<br>Chatbot configuration]
    end

    subgraph Example[AI Assistant Example]
        direction TB
        User([User Request])
        Assistant[AI Assistant<br>Drupal CMS Chatbot]
        Prompt[AI Prompt<br>System instructions]
        Agent[AI Agent<br>Content Type Agent]
        Tool1[AI Tool<br>create_content_type]
        Tool2[AI Tool<br>add_field]
        Provider[AI Provider<br>Anthropic - Claude]
        Result([Content type created])

        User --> Assistant
        Assistant --> Prompt
        Prompt --> Agent
        Agent --> Tool1
        Agent --> Tool2
        Tool1 --> Result
        Tool2 --> Result
    end

    LLM[(External LLM)]

    Legend ~~~ Example
    Agent <--> Provider
    Provider <--> LLM

    style L_Provider fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style L_Prompt fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style L_Tool fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    style L_Agent fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style L_Assistant fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px

    style Provider fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style Prompt fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style Tool1 fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    style Tool2 fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    style Agent fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    style Assistant fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
```

**Flow explanation:**
1. **User** asks the chatbot to create a Blog content type
2. **AI Assistant** (Drupal CMS Chatbot) receives the request
3. **AI Prompt** provides system instructions defining the assistant's behavior
4. **AI Agent** (Content Type Agent) is invoked to handle the task autonomously
5. **AI Provider** sends requests to the external LLM (Claude/Anthropic)
6. **AI Tools** execute the actual Drupal operations (`create_content_type()`, `add_field()`)
7. **Result**: Blog content type is created in Drupal

## Entity Definitions Summary

| Entity | Type | What It Does | Official Documentation |
|--------|------|--------------|------------------------|
| **AI Provider** | Plugin | **The foundation layer** - wraps ALL communication with external LLMs. Handles API calls, authentication, and translates Drupal requests into service-specific API interactions. Every other entity goes through a Provider. | [Writing an AI Provider](https://project.pages.drupalcode.org/ai/2.0.x/developers/writing_an_ai_provider/) |
| **AI Agent** | Config Entity | **Autonomous AI system** - has a system prompt, available tools (function calls), and runs in a loop until the task is complete. Can use tools to modify Drupal config, create content, and even orchestrate other agents. Most powerful entity. | [Building an Agent](https://project.pages.drupalcode.org/ai/2.0.x/agents/build_agent/) |
| **AI Assistant** | Config Entity | **Chatbot configuration** - normalizes interactions between users and LLMs as chatbots. Defines which "actions" (not tools) the chatbot can trigger. Powers the AI Chatbot UI module. | [AI Assistant API](https://project.pages.drupalcode.org/ai/2.0.x/modules/ai_assistant_api/) |
| **AI Automator** | Config Entity | **Field-level automation** - attaches to specific entity fields and automatically generates/modifies field values when content is saved. Can chain multiple automators for complex workflows. | [AI Automators](https://project.pages.drupalcode.org/ai/2.0.x/modules/ai_automators/) |
| **AI Prompt** | Config Entity | **Reusable prompt templates** - stores prompt text with variables (`{word}`) and tokens (`[node:title]`). Bundled by AI Prompt Type. Enables centralized prompt management across all AI features. | [Prompt Management](https://project.pages.drupalcode.org/ai/2.0.x/developers/ai_prompt_management/) |
| **AI Chat** | Operation Type | **Not an entity** - it's a capability/operation type that defines conversational calls to LLMs. Variants include basic chat, streaming, with tools, with vision, etc. | [Chat Call](https://project.pages.drupalcode.org/ai/2.0.x/developers/call_chat/) |
| **AI Tool** | Plugin | **Executable actions** - plugins that AI Agents can call during their execution loop. Includes Function Calls (create content types, modify fields) and Assistant Actions (search, fetch data). The "hands" of the AI. | [Function Calling](https://project.pages.drupalcode.org/ai/2.0.x/developers/function_calling/) |

## How They Work Together

```mermaid
sequenceDiagram
    participant User
    participant Assistant as AI Assistant<br>(Chatbot)
    participant Agent as AI Agent
    participant Automator as AI Automator
    participant Prompt as AI Prompt
    participant Provider as AI Provider
    participant LLM as External LLM

    Note over User,LLM: Scenario 1: User asks chatbot a question
    User->>Assistant: "Create an article about cats"
    Assistant->>Prompt: Load system prompt template
    Prompt-->>Assistant: Prompt with variables resolved
    Assistant->>Provider: Send chat request
    Provider->>LLM: API call (Anthropic/OpenAI/etc)
    LLM-->>Provider: Response
    Provider-->>Assistant: Formatted response
    Assistant-->>User: "Here's your article..."

    Note over User,LLM: Scenario 2: Agent performs autonomous task
    User->>Agent: "Create a Blog content type with fields"
    Agent->>Prompt: Load agent system prompt
    loop Agent Loop (max iterations)
        Agent->>Provider: Chat with tools
        Provider->>LLM: API call
        LLM-->>Provider: "Use create_content_type tool"
        Provider-->>Agent: Tool call request
        Agent->>Agent: Execute tool (create content type)
        Agent->>Provider: Report tool result
    end
    Agent-->>User: "Created Blog content type with 5 fields"

    Note over User,LLM: Scenario 3: Automator generates field on save
    User->>Automator: Save node (triggers automator)
    Automator->>Prompt: Load automator prompt template
    Prompt-->>Automator: "Summarize: [node:body]"
    Automator->>Provider: Generate summary
    Provider->>LLM: API call
    LLM-->>Provider: Summary text
    Provider-->>Automator: Response
    Automator->>Automator: Save to summary field
```

## AI Prompt Use Cases

**AI Prompt** is a shared infrastructure entity that can be used by multiple consumer entities. Here's where and how it's used:

| Consumer | How AI Prompt Is Used | Example |
|----------|----------------------|---------|
| **AI Agent** | Defines the agent's system prompt and behavior instructions | *"You are a Drupal assistant. Use tools to help users manage content types."* |
| **AI Assistant** | Provides the chatbot's personality and conversation style | *"You are a helpful customer service bot for {site_name}. Be friendly and concise."* |
| **AI Automator** | Templates for field generation with token replacement | *"Generate a summary of the following content: [node:body:value]"* |
| **AI CKEditor** | Prompts for in-editor AI assistance (tone adjustment, translation) | *"Rewrite the following text in a {tone} tone: {text}"* |
| **AI Content** | Prompts for content operations (summarize, suggest tags) | *"Suggest 5 taxonomy terms for: [node:title]"* |
| **Custom Modules** | Any module can load and use AI Prompts via the API | Developer-defined prompts for custom AI features |

### AI Prompt Structure

```
┌─────────────────────────────────────────────────────────┐
│ AI Prompt Type: "content_summary"                       │
│   - Allowed variables: {max_length}, {style}            │
│   - Allowed tokens: [node:*], [current-user:*]          │
├─────────────────────────────────────────────────────────┤
│ AI Prompt: "content_summary__blog_summary"              │
│   Prompt text:                                          │
│   "Summarize the following blog post in {max_length}    │
│    words using a {style} style:                         │
│    Title: [node:title]                                  │
│    Body: [node:body:value]"                             │
└─────────────────────────────────────────────────────────┘
```

### Loading AI Prompts in Code

```php
// Load an AI Prompt entity
$prompt = \Drupal::entityTypeManager()
  ->getStorage('ai_prompt')
  ->load('content_summary__blog_summary');

// Get the prompt text and replace variables
$prompt_text = $prompt->get('prompt')->value;
$prompt_text = str_replace('{max_length}', '100', $prompt_text);
$prompt_text = str_replace('{style}', 'professional', $prompt_text);

// Replace tokens using Drupal's token service
$prompt_text = \Drupal::token()->replace($prompt_text, ['node' => $node]);
```

## Key Relationships Explained

### 1. AI Provider is the Foundation

Everything flows through the AI Provider. It's the **only entity that communicates with external LLMs**.

```
AI Agent ──────┐
AI Assistant ──┼──► AI Provider ──► External LLM (OpenAI, Anthropic, etc.)
AI Automator ──┘
```

**Source:** [AI Provider Architecture](https://project.pages.drupalcode.org/ai/2.0.x/developers/writing_an_ai_provider/)

### 2. AI Agent vs AI Assistant

| Aspect | AI Agent | AI Assistant |
|--------|----------|--------------|
| **Purpose** | Autonomous task execution | User-facing conversations |
| **Execution** | Loops until task complete | Single request-response |
| **Capabilities** | Uses **tools** (function calling) | Triggers **actions** (plugins) |
| **Scope** | Can modify Drupal config, create views, etc. | Responds to user queries, triggers limited actions |
| **Use Case** | "Create a content type with these fields" | "What are today's news articles?" |

**Source:** [AI Agents Module](https://www.drupal.org/project/ai_agents) | [AI Assistant API](https://project.pages.drupalcode.org/ai/2.0.x/modules/ai_assistant_api/)

### 3. AI Automator Chains

Automators can be chained to create complex workflows:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Automator 1 │───►│ Automator 2 │───►│ Automator 3 │
│ Extract text│    │ Summarize   │    │ Translate   │
│ from PDF    │    │ content     │    │ to Spanish  │
└─────────────┘    └─────────────┘    └─────────────┘
     Weight: 0          Weight: 1          Weight: 2
```

**Source:** [AI Automators Documentation](https://project.pages.drupalcode.org/ai/2.0.x/modules/ai_automators/)

---

## Official Resources

| Resource | URL |
|----------|-----|
| **Drupal AI Module** | https://www.drupal.org/project/ai |
| **AI 2.0.x Documentation** | https://project.pages.drupalcode.org/ai/2.0.x/ |
| **AI Agents Module** | https://www.drupal.org/project/ai_agents |
| **AI Agents Documentation** | https://project.pages.drupalcode.org/ai_agents |
| **AI Provider Development** | https://project.pages.drupalcode.org/ai/2.0.x/developers/writing_an_ai_provider/ |
| **AI Prompt Management** | https://project.pages.drupalcode.org/ai/2.0.x/developers/ai_prompt_management/ |
| **AI Automators** | https://project.pages.drupalcode.org/ai/2.0.x/modules/ai_automators/ |
| **AI Assistant API** | https://project.pages.drupalcode.org/ai/2.0.x/modules/ai_assistant_api/ |

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

*Generated for Drupal AI ecosystem documentation. Last updated: April 20, 2026*
