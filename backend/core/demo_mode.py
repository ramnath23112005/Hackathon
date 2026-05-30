from core.config import settings
from core.logger import setup_logger

logger = setup_logger("demo_mode")

CACHED_RESPONSES: list[dict] = [
    {
        "keywords": ["ai", "startup", "funding", "investor", "tech", "openai", "agent", "ml"],
        "wire": {
            "summary_context": (
                "The AI startup landscape in 2026 is experiencing unprecedented growth, "
                "with venture capital funding reaching new highs. Sequoia Capital and Andreessen Horowitz "
                "have invested heavily in generative AI, autonomous agents, and enterprise AI solutions. "
                "Multiple startups have achieved unicorn status in the past quarter alone."
            ),
            "key_entities": ["@Sequoia", "@A16Z", "@YC", "#AI", "#startups", "#funding"],
            "trends": ["Generative AI expansion", "Autonomous agent startups", "Enterprise AI adoption", "AI-first SaaS products"],
            "sources": [
                {"source": "Reddit", "error": None, "count": 12},
                {"source": "Google News", "error": None, "count": 18},
                {"source": "Web", "error": None, "count": 8},
            ],
            "results": [
                {"source": "Google News", "title": "Top AI Startups to Watch in 2026", "text": "Venture capital firms have invested over $50B in AI startups this year, with generative AI and autonomous agents leading the charge.", "url": "https://example.com/ai-startups"},
                {"source": "Reddit", "title": "r/startups: Which AI startups are hiring right now?", "text": "Thread discussing current hiring trends at AI startups. Companies focused on enterprise AI tools and developer infrastructure are hiring aggressively.", "url": "https://reddit.com/r/startups/ai-hiring"},
                {"source": "Google News", "title": "Sequoia Leads $300M Round in AI Agent Startup", "text": "Sequoia Capital led a massive funding round in an AI agent startup that builds autonomous work assistants.", "url": "https://example.com/sequoia-ai-agent"},
                {"source": "Web", "title": "YC's Top AI Startups Summer 2026 Batch", "text": "Y Combinator's latest batch features over 40 AI companies, with focus on AI coding tools, customer service automation, and healthcare AI.", "url": "https://example.com/yc-ai-batch"},
                {"source": "Reddit", "title": "r/MachineLearning: State of AI - Q2 2026", "text": "Comprehensive analysis noting enterprise AI adoption tripled year-over-year and AI-native companies are outperforming incumbents.", "url": "https://reddit.com/r/ml/ai-2026"},
            ],
        },
        "llm": {
            "summary": "AI startups in 2026 are experiencing a funding boom led by Sequoia, A16Z, and YC, with over $50B invested year-to-date. Generative AI, autonomous agents, and enterprise AI solutions dominate. Multiple startups achieved unicorn status, hiring is aggressive across AI-native companies.",
            "key_trends": ["Generative AI funding boom continuing through 2026", "Autonomous agent startups attracting major VC interest", "Enterprise AI adoption tripling year-over-year", "AI coding tools and developer infrastructure growing rapidly"],
            "insights": ["Sequoia, A16Z, and YC are the most active AI startup investors this year", "AI agent companies are the hottest category in the current funding cycle", "Enterprise AI transitioning from experimental to production-grade"],
            "opportunities": ["AI-powered developer tools as an underserved market", "Healthcare AI applications showing strong growth", "Autonomous agents for enterprise workflows gaining traction"],
            "risk_signals": ["Valuation inflation in later-stage AI rounds", "Regulatory uncertainty around AI agent autonomy", "Talent competition driving up engineering costs"],
            "source_attribution": ["Sequoia Capital", "Andreessen Horowitz", "Y Combinator", "TechCrunch", "Reddit r/startups"],
        },
    },
    {
        "keywords": ["sentiment", "opinion", "mood", "feel", "think", "reddit", "people"],
        "wire": {
            "summary_context": (
                "Across Reddit and news platforms, public sentiment around major tech companies is mixed. "
                "Recent discussions show optimism about AI advancements but concern about job displacement "
                "and regulatory gaps. Community discussions on r/technology and r/Futurology highlight "
                "both excitement and caution around rapid innovation."
            ),
            "key_entities": ["#AI", "#privacy", "#regulation", "#jobs", "@OpenAI", "@Google"],
            "trends": ["Growing concern about AI regulation", "Optimism for AI productivity gains", "Privacy debate intensifying"],
            "sources": [
                {"source": "Reddit", "error": None, "count": 24},
                {"source": "Google News", "error": None, "count": 15},
                {"source": "Web", "error": None, "count": 6},
            ],
            "results": [
                {"source": "Reddit", "title": "r/technology: Megathread on latest AI developments", "text": "Mixed reactions as new AI capabilities are announced. Users debate the balance between innovation speed and safety precautions.", "url": "https://reddit.com/r/technology/ai-discussion"},
                {"source": "Google News", "title": "Public Opinion on AI Shifts as Tools Become Mainstream", "text": "New polling data shows 62% of professionals now use AI tools weekly, up from 38% last year. Concerns about job impact remain high.", "url": "https://example.com/ai-sentiment-poll"},
                {"source": "Reddit", "title": "r/Futurology: Are we moving too fast with AI?", "text": "Vigorous discussion about the pace of AI deployment. Some users argue for more regulation while others emphasize competitive necessity.", "url": "https://reddit.com/r/Futurology/ai-pace"},
            ],
        },
        "llm": {
            "summary": "Public sentiment around AI and major tech companies is polarized. Optimism about AI-driven productivity gains is tempered by concerns about job displacement, privacy, and regulatory gaps. The discourse is evolving rapidly as AI tools become mainstream.",
            "key_trends": ["Mixed public sentiment on AI advancement", "Growing calls for AI regulation", "AI adoption accelerating across industries"],
            "insights": ["62% of professionals now use AI tools weekly, up from 38%", "Debate centers on innovation speed vs safety", "Regulatory frameworks struggling to keep pace"],
            "opportunities": ["AI education and upskilling platforms", "Transparent AI governance consulting", "Privacy-preserving AI tools"],
            "risk_signals": ["Potential regulatory backlash slowing innovation", "Public trust erosion from misuse incidents", "Talent gap in AI ethics and safety"],
            "source_attribution": ["Reddit r/technology", "Reddit r/Futurology", "Pew Research", "TechCrunch", "The Verge"],
        },
    },
    {
        "keywords": ["cyber", "security", "hack", "breach", "threat", "vulnerability", "ransomware"],
        "wire": {
            "summary_context": (
                "Cybersecurity landscape in 2026 shows increasing sophistication of attacks, with AI-powered "
                "threats on the rise. Ransomware incidents have evolved, and zero-day vulnerabilities are "
                "being exploited faster than ever. Companies are investing heavily in AI-driven defense systems."
            ),
            "key_entities": ["#cybersecurity", "#ransomware", "#zeroday", "@CISA", "#infosec"],
            "trends": ["AI-powered cyber attacks increasing", "Ransomware tactics evolving", "Zero-day exploit acceleration"],
            "sources": [
                {"source": "Google News", "error": None, "count": 20},
                {"source": "Reddit", "error": None, "count": 14},
                {"source": "Web", "error": None, "count": 7},
            ],
            "results": [
                {"source": "Google News", "title": "AI-Powered Cyber Attacks Pose New Threat Landscape", "text": "Security firms report a 340% increase in AI-assisted cyber attacks this year, with deepfake social engineering and automated vulnerability discovery leading the trend.", "url": "https://example.com/ai-cyber-threats"},
                {"source": "Reddit", "title": "r/cybersecurity: How are you defending against AI threats?", "text": "Professionals share strategies for defending against AI-generated phishing attacks and automated exploitation attempts.", "url": "https://reddit.com/r/cybersecurity/ai-defense"},
                {"source": "Google News", "title": "Major Ransomware Attack Hits Healthcare Sector", "text": "Coordinated ransomware attack affected multiple hospital systems, highlighting the growing need for robust cybersecurity infrastructure in critical sectors.", "url": "https://example.com/healthcare-ransomware"},
            ],
        },
        "llm": {
            "summary": "Cybersecurity threats have evolved significantly with AI-powered attacks increasing 340% year-over-year. Ransomware tactics are more sophisticated, and zero-day vulnerabilities are exploited faster. Organizations are racing to implement AI-driven defense systems.",
            "key_trends": ["AI-powered cyber attacks rising 340% YoY", "Ransomware tactics evolving with AI assistance", "Zero-day exploit windows shrinking"],
            "insights": ["Deepfake social engineering is the fastest-growing attack vector", "Healthcare and critical infrastructure are primary targets", "AI defense systems spending up 200%"],
            "opportunities": ["AI-powered cybersecurity solutions market expanding", "Security automation for small and medium businesses", "Incident response consulting services"],
            "risk_signals": ["Attack sophistication outpacing defense capabilities", "Cybersecurity talent shortage worsening", "Critical infrastructure vulnerabilities remain high"],
            "source_attribution": ["Krebs on Security", "BleepingComputer", "Reddit r/cybersecurity", "CISA", "Dark Reading"],
        },
    },
    {
        "keywords": ["remote", "work", "job", "hire", "career", "salary", "employment", "intern"],
        "wire": {
            "summary_context": (
                "The job market in 2026 continues to evolve with remote and hybrid work models becoming permanent "
                "fixtures. Tech hiring has stabilized after the post-pandemic correction, with AI and cybersecurity "
                "roles seeing the strongest demand. Salary transparency laws are reshaping compensation discussions."
            ),
            "key_entities": ["#remotework", "#hiring", "#jobs", "#tech", "#salary"],
            "trends": ["Remote work now standard in tech", "AI roles dominating hiring demand", "Salary transparency becoming law"],
            "sources": [
                {"source": "Google News", "error": None, "count": 16},
                {"source": "Reddit", "error": None, "count": 22},
                {"source": "Web", "error": None, "count": 10},
            ],
            "results": [
                {"source": "Reddit", "title": "r/cscareerquestions: State of tech hiring 2026", "text": "Discussion thread with hundreds of comments about the current tech job market. AI/ML roles are hot, entry-level remains competitive.", "url": "https://reddit.com/r/cscareerquestions/hiring-2026"},
                {"source": "Google News", "title": "Remote Work Is Now Permanent for 40% of Tech Workers", "text": "New survey shows 40% of tech workers are fully remote, 35% hybrid, and only 25% fully in-office. Companies offering flexibility have higher retention.", "url": "https://example.com/remote-work-stats"},
                {"source": "Web", "title": "Highest Paying Tech Roles in 2026", "text": "AI engineers command top salaries with average compensation exceeding $250K. Cybersecurity roles follow closely at $220K average.", "url": "https://example.com/tech-salaries-2026"},
            ],
        },
        "llm": {
            "summary": "The 2026 job market shows remote work as a permanent standard in tech, with AI and cybersecurity roles dominating hiring demand. Salary transparency laws are reshaping compensation. Tech hiring has stabilized with strong demand for AI/ML expertise.",
            "key_trends": ["Remote work permanent for 40% of tech workers", "AI roles commanding highest salaries", "Salary transparency becoming standard"],
            "insights": ["AI engineers average $250K+ compensation", "Entry-level tech market remains competitive", "Companies with flexibility have 2x retention"],
            "opportunities": ["AI upskilling and bootcamp programs", "Remote-first HR and compliance tools", "Salary data and transparency platforms"],
            "risk_signals": ["Entry-level saturation in some tech fields", "Return-to-office mandates causing attrition", "Automation displacing some junior roles"],
            "source_attribution": ["LinkedIn Workforce Report", "Glassdoor", "Reddit r/cscareerquestions", "Bloomberg", "Indeed Hiring Lab"],
        },
    },
]

DEFAULT_RESPONSE = CACHED_RESPONSES[0]


def _match_response(query: str) -> dict:
    query_lower = query.lower()
    best_match = DEFAULT_RESPONSE
    best_score = 0

    for entry in CACHED_RESPONSES:
        score = sum(1 for kw in entry["keywords"] if kw in query_lower)
        if score > best_score:
            best_score = score
            best_match = entry

    return best_match


def get_demo_wire_response(query: str) -> dict:
    match = _match_response(query)
    logger.info("DEMO_MODE Wire fallback for '%s' — matched score=%d", query, sum(1 for kw in match["keywords"] if kw in query.lower()))
    return {"normalized": match["wire"], "raw": []}


def get_demo_llm_response(query: str) -> dict:
    match = _match_response(query)
    logger.info("DEMO_MODE LLM fallback for '%s'", query)
    return match["llm"]


def is_demo_mode() -> bool:
    return settings.demo_mode
