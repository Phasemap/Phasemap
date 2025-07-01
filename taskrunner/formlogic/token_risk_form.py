from pydantic import BaseModel, Field, validator
from typing import Optional


class TokenRiskForm(BaseModel):
    token_mint: str = Field(..., description="SPL token mint address")
    timeframe_hours: int = Field(24, ge=1, le=168, description="Timeframe in hours to scan")
    include_wallet_scan: bool = Field(default=False)
    include_flashloan_check: bool = Field(default=True)

    @validator("token_mint")
    def validate_mint_format(cls, v):
        if len(v) < 32 or len(v) > 44:
            raise ValueError("Invalid Solana token address length")
        return v
