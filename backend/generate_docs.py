from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

title = doc.add_heading("InternetOS — Setup & Integration Report", 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph("").add_run("").add_break()

# Section 1
doc.add_heading("1. Project Overview", 1)
doc.add_paragraph(
    "InternetOS is an AI-powered autonomous internet research agent. "
    "It consists of a FastAPI backend (Python) and a Next.js frontend (TypeScript + Tailwind). "
    "The backend searches the web via Anakin Wire, then passes results to an LLM for intelligence analysis."
)

# Section 2
doc.add_heading("2. Initial LLM Setup", 1)
doc.add_paragraph("Originally, the backend was configured to use Ollama running locally with Qwen:")
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("LLM Provider: ").bold = True
p.add_run("Ollama (local)")
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("Model: ").bold = True
p.add_run("qwen3.5:latest")
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("Base URL: ").bold = True
p.add_run("http://localhost:11434/v1")
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("API Key: ").bold = True
p.add_run("ollama (dummy value)")

# Section 3
doc.add_heading("3. Problem — Ollama Not Working", 1)
doc.add_paragraph(
    "On Windows, the Ollama server process crashed repeatedly with exit status 1. "
    "The logs showed the server failing to start, which prevented the LLM from being reachable. "
    "The frontend displayed fallback data:"
)
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run('"Analysis unavailable due to LLM service error."')

# Section 4
doc.add_heading("4. Deployment on Render", 1)
doc.add_paragraph(
    "The app was deployed on Render as a free web service. "
    "Render does not support running Ollama (no GPU/container-level access for free instances). "
    "An OpenAI API key was configured on Render, but it required a paid subscription to work."
)

# Section 5
doc.add_heading("5. Solution — Switch to Groq Free Tier", 1)
doc.add_paragraph(
    "Groq provides fast, free inference for multiple open-source models with a fully OpenAI-compatible API. "
    "No code changes were needed since the backend's llm_service.py already uses the OpenAI SDK with "
    "configurable base_url, api_key, and model from environment variables."
)

doc.add_heading("5.1 Environment Variables Changed", 2)
doc.add_paragraph("Local .env (backend\\.env):")

table = doc.add_table(rows=4, cols=3, style="Light Grid Accent 1")
headers = ["Variable", "Old Value", "New Value"]
for i, h in enumerate(headers):
    table.rows[0].cells[i].text = h

data = [
    ("OPENAI_API_KEY", "ollama", "gsk_your_groq_api_key_here"),
    ("OPENAI_BASE_URL", "http://localhost:11434/v1", "https://api.groq.com/openai/v1"),
    ("OPENAI_MODEL", "qwen3.5:latest", "llama-3.3-70b-versatile"),
]
for row_idx, (key, old, new) in enumerate(data, start=1):
    table.rows[row_idx].cells[0].text = key
    table.rows[row_idx].cells[1].text = old
    table.rows[row_idx].cells[2].text = new

doc.add_paragraph("")
doc.add_paragraph("The .env.example was also updated to reflect the new defaults.")

# Section 6
doc.add_heading("6. Groq Model Discovery", 1)
doc.add_paragraph(
    "The initially chosen model mixtral-8x7b-32768 had been decommissioned by Groq. "
    "We queried the Groq models endpoint and found these working alternatives:"
)
models = [
    "llama-3.3-70b-versatile (recommended)",
    "llama-3.1-8b-instant (fast)",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
]
for m in models:
    p = doc.add_paragraph()
    p.style = doc.styles["List Bullet"]
    p.add_run(m)

# Section 7
doc.add_heading("7. Verification", 1)
doc.add_paragraph(
    "The Groq API key was tested directly via curl with llama-3.3-70b-versatile — it returned a valid response."
)
doc.add_paragraph(
    "The frontend was tested with the query \"top AI startups 2026\". "
    "The backend successfully returned an intelligence report with:"
)
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("Summary: ").bold = True
p.add_run("Analysis of top AI startups funded by Sequoia, Y Combinator, and A16Z")
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("Key Trends: ").bold = True
p.add_run("Increased investment, growing innovation, focus on business applications")
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("Insights: ").bold = True
p.add_run("Prominent investors backing AI startups, multiple lists highlighting top startups")
p = doc.add_paragraph()
p.style = doc.styles["List Bullet"]
p.add_run("Risk Signals: ").bold = True
p.add_run("Rapid evolution causing uncertainty")

# Section 8
doc.add_heading("8. Render Dashboard Update", 1)
doc.add_paragraph(
    "The following environment variables must be updated on the Render dashboard:"
)
for key, val in [
    ("OPENAI_API_KEY", "gsk_your_groq_api_key_here"),
    ("OPENAI_BASE_URL", "https://api.groq.com/openai/v1"),
    ("OPENAI_MODEL", "llama-3.3-70b-versatile"),
    ("OPENAI_TEMPERATURE", "0.3"),
    ("OPENAI_TIMEOUT", "30"),
    ("OPENAI_MAX_RETRIES", "2"),
]:
    p = doc.add_paragraph()
    p.style = doc.styles["List Bullet"]
    p.add_run(f"{key}: ").bold = True
    p.add_run(val)

doc.add_paragraph(
    "After updating, trigger a Manual Deploy with \"Clear build cache & deploy\" on Render."
)

# Section 9
doc.add_heading("9. Alternative Free Providers", 1)
doc.add_paragraph("Other OpenAI-compatible free alternatives that could also work:")
table2 = doc.add_table(rows=4, cols=3, style="Light Grid Accent 1")
table2.rows[0].cells[0].text = "Provider"
table2.rows[0].cells[1].text = "Base URL"
table2.rows[0].cells[2].text = "Free Model"
table2.rows[1].cells[0].text = "Groq"
table2.rows[1].cells[1].text = "https://api.groq.com/openai/v1"
table2.rows[1].cells[2].text = "llama-3.3-70b-versatile"
table2.rows[2].cells[0].text = "GitHub Models"
table2.rows[2].cells[1].text = "https://models.inference.ai.azure.com"
table2.rows[2].cells[2].text = "gpt-4o-mini"
table2.rows[3].cells[0].text = "OpenRouter"
table2.rows[3].cells[1].text = "https://openrouter.ai/api/v1"
table2.rows[3].cells[2].text = "google/gemini-2.0-flash-exp:free"

# Save
doc.save("InternetOS_Setup_Report.docx")
print("DOCX created: InternetOS_Setup_Report.docx")
