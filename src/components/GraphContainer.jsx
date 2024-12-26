import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import Box from '@mui/material/Box';

const GraphContainer = ({ graphData, cyRef, eulerianData }) => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                border: '1px solid black'
            }}
            className={eulerianData.color}
        >
            <CytoscapeComponent
                className='GraphContainer'
                cy={(cy) => { cyRef.current = cy; }}
                elements={CytoscapeComponent.normalizeElements({ nodes: graphData.nodes, edges: graphData.edges })}
                style={{ width: '100%', height: '100%' }}
            />
        </Box>
    );
};

export default GraphContainer;
