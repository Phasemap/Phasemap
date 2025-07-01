from pydantic import BaseModel, Field, validator


class WalletBehaviorForm(BaseModel):
    wallet_address: str = Field(..., description="Solana wallet public key")
    depth: int = Field(default=2, ge=1, le=5, description="Depth of connected wallet scan")
    analyze_tokens: bool = Field(default=True)
    scan_inbound_outbound: bool = Field(default=True)

    @validator("wallet_address")
    def validate_address(cls, v):
        if len(v) < 32 or len(v) > 44:
            raise ValueError("Invalid wallet address format")
        return v
