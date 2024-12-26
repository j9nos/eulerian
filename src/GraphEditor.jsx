import React, { useState, useEffect, useRef } from "react";
import GraphContainer from "./components/GraphContainer";
import Toolbox from "./components/Toolbox";
import Box from "@mui/material/Box";
import EulerianPathModal from "./components/EulerianPathModal";
import { EulerianPathFinder } from "./util/EulerianPathFinder";
import { myFavGraphShape } from "./data/myFavGraphShape";

const GraphEditor = () => {
    const cyRef = useRef(null);

    const [selection, setSelection] = useState({
        nodes: [],
        edges: []
    });

    const [graphData, setGraphData] = useState(myFavGraphShape);

    const [eulerianData, setEulerianData] = useState({
        color: '',
        path: []
    });

    const [showModal, setShowModal] = useState(false);


    const actions = (() => {
        const _removeNodes = function () {
            const remainingNodes = graphData.nodes.filter(node => !selection.nodes.includes(node.data.id));
            const remainingEdges = graphData.edges.filter(edge =>
                !selection.nodes.includes(edge.data.source) && !selection.nodes.includes(edge.data.target));
            setGraphData(prevData => ({
                ...prevData,
                nodes: remainingNodes,
                edges: remainingEdges
            }));
            setSelection(prevData => ({
                ...prevData,
                nodes: [],
                edges: []
            }));
        };
        const _removeEdges = function () {
            const remainingEdges = graphData.edges.filter(edge => !selection.edges.includes(edge.data.id));
            setGraphData(prevData => ({
                ...prevData,
                edges: remainingEdges
            }));
            setSelection(prevData => ({
                ...prevData,
                nodes: [],
                edges: []
            }));
        };

        return {
            addNode: function () {
                const largestId = graphData.nodes.length > 0
                    ? Math.max(...graphData.nodes.map(node => parseInt(node.data.id)))
                    : 0;
                const newNodeId = largestId + 1;
                const newNode = {
                    data: { id: newNodeId, label: newNodeId },
                    position: { x: Math.random() * 700, y: Math.random() * 700 }
                };

                setGraphData(prevData => ({
                    ...prevData,
                    nodes: [...prevData.nodes, newNode]
                }));

                if (selection.nodes.length !== 1) {
                    return;
                }

                const newEdge = { data: { source: newNodeId, target: selection.nodes[0] } };
                setGraphData(prevData => ({
                    ...prevData,
                    edges: [...prevData.edges, newEdge]
                }));
            },

            addEdge: function () {
                if (selection.nodes.length !== 2) {
                    return;
                }
                const [source, target] = selection.nodes;

                if (graphData.edges.some(
                    edge => (edge.data.source === source && edge.data.target === target) ||
                        (edge.data.source === target && edge.data.target === source)
                )) {
                    return;
                }


                const newEdge = { data: { source, target } };
                setGraphData(prevData => ({
                    ...prevData,
                    edges: [...prevData.edges, newEdge]
                }));
            },

            removeSelected: function () {
                if (selection.nodes.length) {
                    _removeNodes();
                } else if (selection.edges.length) {
                    _removeEdges();
                }
            }
        };
    })();


    useEffect(() => {
        if (cyRef.current) {
            const cy = cyRef.current;

            cy.on('select', 'node', (event) => {
                const selectedNodeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newNodes = prevSelection.nodes.includes(selectedNodeId)
                        ? prevSelection.nodes
                        : [...prevSelection.nodes, selectedNodeId];
                    return { ...prevSelection, nodes: newNodes };
                });
            });

            cy.on('unselect', 'node', (event) => {
                const unselectedNodeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newNodes = prevSelection.nodes.filter(id => id !== unselectedNodeId);
                    return { ...prevSelection, nodes: newNodes };
                });
            });

            cy.on('select', 'edge', (event) => {
                const selectedEdgeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newEdges = prevSelection.edges.includes(selectedEdgeId)
                        ? prevSelection.edges
                        : [...prevSelection.edges, selectedEdgeId];
                    return { ...prevSelection, edges: newEdges };
                });
            });

            cy.on('unselect', 'edge', (event) => {
                const unselectedEdgeId = event.target.data().id;
                setSelection((prevSelection) => {
                    const newEdges = prevSelection.edges.filter(id => id !== unselectedEdgeId);
                    return { ...prevSelection, edges: newEdges };
                });
            });
        }

    }, []);

    useEffect(() => {
        const eulerianPathFinder = new EulerianPathFinder(graphData, setEulerianData);
        eulerianPathFinder.find();
        console.log(graphData);
    }, [graphData]);


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
        }}>
            <Toolbox
                graphData={graphData}
                actions={actions}
                selection={selection}
                eulerianData={eulerianData}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            <GraphContainer
                graphData={graphData}
                cyRef={cyRef}
                eulerianData={eulerianData}
            />
            <EulerianPathModal
                showModal={showModal}
                setShowModal={setShowModal}
                eulerianPath={eulerianData.path}
            />
        </Box>
    )

};

export default GraphEditor;