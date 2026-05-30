from core.config import settings
from core.logger import setup_logger

logger = setup_logger("demo_mode")

DEMO_WIRE_RESPONSE = {
    "normalized": {
        "summary_context": (
            "The AI startup landscape in 2026 is experiencing unprecedented growth, "
            "with venture capital funding reaching new highs. Sequoia Capital and Andreessen Horowitz "
            "have invested heavily in generative AI, autonomous agents, and enterprise AI solutions. "
            "Multiple startups have achieved unicorn status in the past quarter alone."
        ),
        "key_entities": ["@Sequoia", "@A16Z", "@YC", "#AI", "#startups", "#funding"],
        "trends": [
            "Generative AI expansion",
            "Autonomous agent startups",
            "Enterprise AI adoption",
            "AI-first SaaS products",
        ],
        "sources": [
            {"source": "Reddit", "error": None, "count": 12},
            {"source": "Google News", "error": None, "count": 18},
            {"source": "Web", "error": None, "count": 8},
        ],
        "results": [
            {
                "source": "Google News",
                "title": "Top AI Startups to Watch in 2026: The Next Wave of Innovation",
                "text": "Venture capital firms have invested over $50B in AI startups this year, with generative AI and autonomous agents leading the charge. Companies like Anthropic, Mistral AI, and Cohere continue to dominate headlines.",
                "url": "https://example.com/ai-startups-2026",
            },
            {
                "source": "Reddit",
                "title": "r/startups: Which AI startups are actually hiring right now?",
                "text": "Thread discussing current hiring trends at AI startups. Multiple users report that companies focused on enterprise AI tools and developer infrastructure are hiring aggressively.",
                "url": "https://reddit.com/r/startups/ai-hiring",
            },
            {
                "source": "Google News",
                "title": "Sequoia Leads $300M Round in AI Agent Startup",
                "text": "Sequoia Capital has led a massive funding round in an AI agent startup that builds autonomous work assistants, signaling strong investor confidence in the AI agent category.",
                "url": "https://example.com/sequoia-ai-agent",
            },
            {
                "source": "Web",
                "title": "YC's Top AI Startups Summer 2026 Batch",
                "text": "Y Combinator's latest batch features over 40 AI companies, with particular concentration in AI coding tools, customer service automation, and healthcare AI applications.",
                "url": "https://example.com/yc-ai-batch",
            },
            {
                "source": "Reddit",
                "title": "r/MachineLearning: State of AI Startups - Q2 2026 Analysis",
                "text": "Comprehensive analysis of the AI startup ecosystem, noting that enterprise AI adoption has tripled year-over-year and that AI-native companies are outperforming incumbents.",
                "url": "https://reddit.com/r/MachineLearning/ai-startups-2026",
            },
        ],
    },
    "raw": [],
}

DEMO_LLM_RESPONSE = {
    "summary": (
        "Top AI startups in 2026 are experiencing a funding boom led by Sequoia, A16Z, and Y Combinator, "
        "with over $50B invested year-to-date. The landscape is dominated by generative AI, autonomous "
        "agents, and enterprise AI solutions. Multiple startups have achieved unicorn status, and "
        "hiring remains aggressive across AI-native companies."
    ),
    "key_trends": [
        "Generative AI funding boom continued through 2026",
        "Autonomous agent startups attracting major VC interest",
        "Enterprise AI adoption tripling year-over-year",
        "AI coding tools and developer infrastructure growing rapidly",
    ],
    "insights": [
        "Sequoia, A16Z, and YC are the most active investors in AI startups this year",
        "AI agent companies are the hottest category in the current funding cycle",
        "Enterprise AI is transitioning from experimental to production-grade deployments",
    ],
    "opportunities": [
        "AI-powered developer tools represent an underserved market",
        "Healthcare AI applications show strong growth potential",
        "Autonomous agents for enterprise workflows are gaining traction",
    ],
    "risk_signals": [
        "Valuation inflation in later-stage AI rounds",
        "Regulatory uncertainty around AI agent autonomy",
        "Talent competition driving up engineering costs",
    ],
    "source_attribution": [
        "Sequoia Capital",
        "Andreessen Horowitz",
        "Y Combinator",
        "TechCrunch",
        "Reddit r/startups",
    ],
}


def get_demo_wire_response(query: str) -> dict:
    logger.info("DEMO_MODE: returning cached Wire response for '%s'", query)
    return DEMO_WIRE_RESPONSE


def get_demo_llm_response(query: str) -> dict:
    logger.info("DEMO_MODE: returning cached LLM response for '%s'", query)
    return DEMO_LLM_RESPONSE


def is_demo_mode() -> bool:
    return settings.demo_mode
