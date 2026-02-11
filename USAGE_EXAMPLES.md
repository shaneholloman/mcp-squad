# Squad MCP Server - Usage Examples

These examples demonstrate real-world usage of the Squad MCP server with Claude. Each example shows the user prompt, the tools that get called, and the expected outcome.

---

## Example 1: Discover Product Opportunities

### User Prompt
```
"What opportunities are in my Squad workspace? Show me the top 3."
```

### What Happens Behind the Scenes
1. Claude calls `select_workspace` to choose your active workspace (if multiple exist)
2. Claude calls `list_opportunities` to retrieve all opportunities
3. Claude analyzes and presents the top opportunities based on status and priority

### Actual Output
```
Your Squad workspace has 5 opportunities. Here are the top 3:

1. **Advanced AI Agent Customization Engine** (New)
   - Build customizable AI agent behaviors and predictive prioritization
     capabilities for enterprise workflows
   - Status: New, with solutions already generated

2. **Enterprise CRM Integration Ecosystem** (New)
   - Enable seamless integration with major CRM platforms

3. **Regulatory Compliance Automation Suite** (New)
   - Automate compliance workflows for regulated industries

All opportunities are currently in "New" status and ready for solution generation.
```

**Tools Called:**
- `select_workspace` (if needed)
- `list_opportunities`

**Value Delivered:** Quick overview of what product opportunities exist, enabling rapid context switching and strategic planning.

---

## Example 2: Explore Solutions for an Opportunity

### User Prompt
```
"Show me the solutions for the AI Agent Customization opportunity,
including which goals it supports."
```

### What Happens Behind the Scenes
1. Claude calls `get_opportunity` with the opportunity ID
2. Requests relationships: solutions, outcomes (goals), and insights
3. Parses the detailed response including PRDs, pros/cons, and goal alignments

### Actual Output
```
The **Advanced AI Agent Customization Engine** opportunity has 3 solutions:

**Solution 1: Workflow Designer** (Priority solution)
- Visual interface for customizing AI agent decision-making processes
- Pros:
  • Enables enterprise customization without technical expertise
  • Adapts to diverse methodologies (SAFe, Scrum, custom frameworks)
  • Maintains AI automation while providing governance compliance
- Cons:
  • Complex interface may extend time-to-market
  • Risk of over-customization affecting AI performance
  • Extensive testing required across configurations

**Solution 2: Methodology Templates**
- Pre-configured AI agent templates for SAFe, Scrum, Kanban, and industry
  verticals (healthcare, fintech, manufacturing)
- Pros:
  • Accelerates enterprise onboarding with ready-made configurations
  • Reduces implementation risk through proven templates
  • Enables rapid vertical market expansion
- Cons:
  • May not fully address unique enterprise requirements
  • Requires ongoing maintenance as methodologies evolve
  • Risk of commoditization

**Solution 3: Impact Predictor** (Planned for next horizon)
- AI-powered forecasting system that predicts solution impact before implementation
- Pros:
  • Reduces enterprise risk with data-driven forecasts
  • Differentiates through predictive capabilities competitors lack
  • Improves strategic decision-making
- Cons:
  • Requires significant historical data for accurate predictions
  • Prediction accuracy may vary across industries
  • Complex ML infrastructure increases operational costs

**Related Goals (Outcomes):**
1. Accelerate Market Penetration in Enterprise Segment (Priority: 5/5)
2. Strengthen Product Differentiation Through AI Innovation (Priority: 5/5)

**Supporting Insights:**
- Feature request: Customizable AI Agent Behavior and Workflow Rules
- Feature request: AI-Powered Predictive Opportunity Prioritization
```

**Tools Called:**
- `get_opportunity` with relationships `["solutions", "outcomes", "insights"]`

**Value Delivered:** Deep dive into solution options with trade-offs clearly laid out, plus visibility into how the opportunity ladders up to strategic goals (Opportunity Solution Tree structure).

---

## Example 3: Understand Strategic Alignment (North Star View)

### User Prompt
```
"Show me my top business goals and which opportunities support them."
```

### What Happens Behind the Scenes
1. Claude calls `list_goals` to get all workspace outcomes
2. For high-priority goals, Claude calls `get_goal` with relationships to see connected opportunities
3. Constructs a hierarchy showing goal → opportunities → solutions

### Actual Output
```
Your workspace has 3 strategic goals:

**Goal 1: Accelerate Market Penetration in Enterprise Segment** ⭐ Priority 5/5
├─ Opportunity: Advanced AI Agent Customization Engine
│  ├─ Solution: Workflow Designer (Visual interface for custom agent behaviors)
│  ├─ Solution: Methodology Templates (SAFe, Scrum, Kanban presets)
│  └─ Solution: Impact Predictor (AI forecasting for ROI predictions)
│
├─ Opportunity: Enterprise Multi-Knowledge Base Platform
└─ Opportunity: Regulatory Compliance Automation Suite

**Goal 2: Strengthen Product Differentiation Through AI Innovation** ⭐ Priority 5/5
├─ Opportunity: Advanced AI Agent Customization Engine (shared with Goal 1)
│  └─ [Same 3 solutions as above]
│
└─ Opportunity: Global Localization and Multi-Language AI

**Goal 3: Expand Geographic Presence in High-Growth Markets** ⭐ Priority 4/5
├─ Opportunity: Global Localization and Multi-Language AI
└─ Opportunity: Enterprise CRM Integration Ecosystem

**Key Insight:** The "Advanced AI Agent Customization Engine" opportunity
supports BOTH of your top-priority goals, making it a strategic lever for
accelerating enterprise adoption while strengthening differentiation.
```

**Tools Called:**
- `list_goals`
- `get_goal` (for each high-priority goal with relationships `["opportunities", "solutions"]`)

**Value Delivered:** Clear visibility into strategic alignment - shows how daily work (solutions) ladders up to opportunities and ultimately to north star business outcomes. This is the core of the Opportunity Solution Tree (OST) methodology.

---

## Example 4: Search for Specific Topics

### User Prompt
```
"Find everything in my workspace related to 'compliance' or 'regulatory'."
```

### What Happens Behind the Scenes
1. Claude calls `similarity_search` with the query terms
2. Squad's vector search finds semantically similar content across opportunities, solutions, knowledge documents, and insights
3. Results are ranked by relevance

### Expected Output
```
Found 8 items related to compliance/regulatory:

**Opportunities:**
- Regulatory Compliance Automation Suite (New)
  "Automate compliance workflows for regulated industries..."

**Solutions:**
- Methodology Templates - Healthcare compliance features
  "Includes HIPAA-aware acceptance criteria and test cases..."

- Workflow Designer - Compliance guardrails
  "Policy blocks for data access scopes, PII redaction, mandatory approvals..."

**Knowledge Documents:**
- SOC 2 Requirements Overview
- GDPR Data Residency Guidelines

**Insights:**
- Feature request: Automated compliance reporting
- Feedback: "Need better audit trail visibility"
```

**Tools Called:**
- `similarity_search` with filters: `["opportunities", "solutions", "knowledge-base", "insights"]`

**Value Delivered:** Fast semantic search across all Squad entities, helping teams quickly find relevant context without manually browsing categories.

---

## Example 5: Generate New Solutions

### User Prompt
```
"The 'AI Agent Customization' opportunity looks interesting.
Can you generate some fresh solution ideas for it?"
```

### What Happens Behind the Scenes
1. Claude calls `generate_solutions` with the opportunity ID
2. Squad's AI Ideation agent analyzes the opportunity context, workspace knowledge, and related insights
3. Generates 3-5 new solution approaches with descriptions, pros/cons, and preliminary PRDs

### Expected Output
```
✨ Generating solutions for "Advanced AI Agent Customization Engine"...

Squad's Ideation agent is analyzing:
- Opportunity context and supporting insights
- Workspace knowledge base and industry trends
- Related outcomes and success criteria
- Comparable solutions from similar opportunities

This typically takes 30-60 seconds. The solutions will include:
- Detailed descriptions and rationale
- Pros and cons for each approach
- Preliminary PRD with requirements and implementation notes
- Alignment to your strategic goals

✅ Complete! 3 new solutions have been added to the opportunity.
Use "Show me the solutions for AI Agent Customization" to review them.
```

**Tools Called:**
- `generate_solutions` (triggers Squad's AI Ideation agent)
- Optionally: `get_opportunity` with `relationships=["solutions"]` to show results

**Value Delivered:** AI-powered ideation that considers your full product context, saving hours of brainstorming and ensuring solutions are grounded in evidence from your knowledge base and customer feedback.

---

## Example 6: Create a New Opportunity

### User Prompt
```
"Create a new opportunity called 'Mobile App Performance Issues' -
we've been seeing complaints about slow load times on iOS."
```

### What Happens Behind the Scenes
1. Claude calls `create_opportunity` with the title and description
2. Squad creates the opportunity in the active workspace
3. Returns the new opportunity ID and confirmation

### Expected Output
```
✅ Created opportunity: **Mobile App Performance Issues**

ID: abc-123-def-456
Status: New
Description: Addressing customer complaints about slow load times on iOS

Next steps:
- Link this to a strategic goal using `manage_opportunity_relationships`
- Add supporting insights or feedback items
- Generate solution ideas with "Generate solutions for this opportunity"
```

**Tools Called:**
- `create_opportunity`

**Value Delivered:** Quickly capture new opportunities as they emerge from customer feedback, team discussions, or market research. All opportunities are automatically connected to your workspace knowledge base for context-aware AI assistance.

---

## Quick Reference: Common Workflows

| User Goal | Example Prompt | Key Tools Used |
|-----------|----------------|----------------|
| **Strategic planning** | "What are my top goals and their progress?" | `list_goals`, `get_goal` |
| **Opportunity discovery** | "Show me opportunities affecting retention" | `list_opportunities`, `similarity_search` |
| **Solution exploration** | "What solutions exist for [opportunity]?" | `get_opportunity` with relationships |
| **Ideation** | "Generate solutions for [opportunity]" | `generate_solutions` |
| **Research** | "Find everything about [topic]" | `similarity_search` |
| **Context setting** | "Switch to my [workspace name]" | `select_workspace` |
| **OST visualization** | "How does [solution] support [goal]?" | `get_goal`, `get_opportunity` with relationships |

---

## Tips for Best Results

1. **Be specific with opportunity names** - Claude will search for the best match
2. **Request relationships** - Ask to "include related goals/solutions/insights" for richer context
3. **Use natural language** - No need to know tool names, just describe what you want
4. **Follow the OST flow** - Goals → Opportunities → Solutions → Requirements
5. **Generate then refine** - Let Squad's AI generate solutions first, then iterate on specific ones

---

## Authentication Note

All examples require OAuth authentication on first use. Claude will prompt you to log in via your browser, then maintain the session across requests. Your data is isolated per workspace and respects all access controls configured in Squad.

---

## More Information

- **Full Tool Reference:** See [README.md](./README.md#-available-tools) for complete tool list
- **Squad Platform:** Visit [meetsquad.ai](https://meetsquad.ai) to learn about Opportunity Solution Trees
- **Support:** Create an issue at [github.com/the-basilisk-ai/squad-mcp/issues](https://github.com/the-basilisk-ai/squad-mcp/issues)
