from typing import List, Dict, Tuple
import networkx as nx


def build_interaction_graph(transfers: List[Tuple[str, str]]) -> nx.Graph:
    graph = nx.Graph()
    for src, dst in transfers:
        graph.add_edge(src, dst)
    return graph


def detect_sybil_clusters(transfers: List[Tuple[str, str]], min_size: int = 4) -> List[List[str]]:
    graph = build_interaction_graph(transfers)
    clusters = []

    for component in nx.connected_components(graph):
        if len(component) >= min_size:
            clusters.append(list(component))

    return clusters


def calculate_sybil_overlap_score(cluster: List[str], known_wallets: List[str]) -> float:
    overlap = set(cluster) & set(known_wallets)
    return round(len(overlap) / len(cluster), 2) if cluster else 0.0
