import React from 'react';

import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const ToolboxButton = ({ text, color, icon, action, disabled = false }) => {
    return (
        <Button
            variant='outlined'
            color={color}
            onClick={action}
            endIcon={icon}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={disabled}
        >
            {text}
        </Button>
    );
};

const Actions = ({ actions, eulerianData, setShowModal}) => {
    return (
        <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <ToolboxButton
                    text='Add Node'
                    color='success'
                    icon={<AddCircleOutlinedIcon />}
                    action={actions.addNode}
                />
                <ToolboxButton
                    text='Add Edge'
                    color='success'
                    icon={<LinkOutlinedIcon />}
                    action={actions.addEdge}
                />
                <ToolboxButton
                    text='Remove Selected'
                    color='error'
                    icon={<CancelOutlinedIcon />}
                    action={actions.removeSelected}
                />
                <ToolboxButton
                    text='View Path'
                    color='secondary'
                    icon={<VisibilityOutlinedIcon />}
                    action={() => setShowModal(true)}
                    disabled={!eulerianData.path.length}
                />
            </Box>
        </Toolbar>
    );

};



const Toolbox = ({ actions, eulerianData, showModal, setShowModal }) => {
    return (
        <AppBar position="static" color="transparent">
            <Container maxWidth="xl">
                <Actions actions={actions} eulerianData={eulerianData} showModal={showModal} setShowModal={setShowModal} />
            </Container>
        </AppBar>
    );
}



export default Toolbox;