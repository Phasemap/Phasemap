from typing import List, Dict
from solana.rpc.api import Client
from solana.publickey import PublicKey


def fetch_recent_signatures(client: Client, address: str, limit: int = 50) -> List[Dict]:
    pubkey = PublicKey(address)
    resp = client.get_signatures_for_address(pubkey, limit=limit)
    return resp.get("result", [])


def fetch_tx_metadata(client: Client, signatures: List[str]) -> List[Dict]:
    metadata = []
    for sig in signatures:
        tx_data = client.get_transaction(sig)
        if tx_data and tx_data.get("result"):
            metadata.append(tx_data["result"])
    return metadata
