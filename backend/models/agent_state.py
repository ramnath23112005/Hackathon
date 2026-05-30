from pydantic import BaseModel


class AgentStep(BaseModel):
    step: str
    label: str
    icon: str
    progress: int


AGENT_STEPS = [
    AgentStep(step="interpreting", label="Understanding user query...", icon="🧠", progress=5),
    AgentStep(step="planning", label="Planning internet search strategy...", icon="📋", progress=15),
    AgentStep(step="searching", label="Querying Wire for live data...", icon="🔎", progress=35),
    AgentStep(step="collecting", label="Collecting results from multiple sources...", icon="📡", progress=50),
    AgentStep(step="normalizing", label="Normalizing structured data...", icon="📊", progress=60),
    AgentStep(step="analyzing", label="Running AI analysis...", icon="🤖", progress=80),
    AgentStep(step="synthesizing", label="Generating final report...", icon="🧾", progress=92),
    AgentStep(step="complete", label="Final report ready", icon="✅", progress=100),
]


class AgentState(BaseModel):
    session_id: str
    query: str
    step: str = "initialized"
    status: str = "running"
    current_action: str = ""
    progress: int = 0
    logs: list[str] = []
    result: dict | None = None
    error: str | None = None
    created_at: str = ""
