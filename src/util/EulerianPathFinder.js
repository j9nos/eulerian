export class EulerianPathFinder {
    #graph;
    #setEulerianData;
    constructor(graphData, setEulerianData) {
        this.#graph = this.#initGraph(graphData);
        this.#setEulerianData = setEulerianData;
    }

    #initGraph(graphData) {
        const graph = {};
        if (!graphData.nodes.length) {
            return graph;
        }
        graphData.nodes.forEach(node => {
            graph[node.data.id] = [];
        });
        graphData.edges.forEach(edge => {
            const { source, target } = edge.data;
            if (!graph[source]) {
                graph[source] = [];
            }
            if (!graph[target]) {
                graph[target] = [];
            }
            graph[source].push(target);
            graph[target].push(source);
        });
        return graph;
    }

    #findEulerianPath(graph, startNode) {
        const stack = [startNode];
        const path = [];
        while (stack.length > 0) {
            const currentNode = stack[stack.length - 1];
            if (graph[currentNode].length > 0) {
                const nextNode = graph[currentNode].pop();
                graph[nextNode] = graph[nextNode].filter(node => node !== currentNode);
                stack.push(nextNode);
            } else {
                path.push(stack.pop());
            }
        }
        return path.reverse();
    }

    #isGraphValid() {
        if (Object.keys(this.#graph).length === 0) {
            return false;
        }
        return Object.values(this.#graph).every(adj => adj.length > 0);
    }

    #oddEdgeNodes() {
        const oddEdgeNodes = [];
        for (const [node, adj] of Object.entries(this.#graph)) {
            if (adj.length % 2 !== 0) {
                oddEdgeNodes.push(node);
            }
        }
        return oddEdgeNodes;
    }

    find() {
        if (!this.#isGraphValid()) {
            this.#setEulerianData(p => ({
                ...p,
                color: 'yellow'
            }));
            return this.#setEulerianData(p => ({
                ...p,
                path: []
            }));
        }

        this.#setEulerianData(p => ({
            ...p,
            color: 'gray'
        }));

        const oddEdgeNodes = this.#oddEdgeNodes();
        if (0 === oddEdgeNodes.length) {
            this.#setEulerianData(p => ({
                ...p,
                color: 'green'
            }));

            return this.#setEulerianData(p => ({
                ...p,
                path: this.#findEulerianPath(this.#graph, Object.keys(this.#graph)[0])
            }));
        }
        if (2 === oddEdgeNodes.length) {
            this.#setEulerianData(p => ({
                ...p,
                color: 'green'
            }));
            return this.#setEulerianData(p => ({
                ...p,
                path: this.#findEulerianPath(this.#graph, oddEdgeNodes[0])
            }));
        }
        this.#setEulerianData(p => ({
            ...p,
            color: 'red'
        }));
        return this.#setEulerianData(p => ({
            ...p,
            path: []
        }));

    }
}
