import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Divider from '@mui/material/Divider';
import LanguageSwitcher from '../../LanguageSwitcher';

interface NavbarDrawerProps {
  isOpenDrawer: boolean;
  setIsOpenDrawer: (open: boolean) => void;
}

function NavbarDrawer({ isOpenDrawer, setIsOpenDrawer }: NavbarDrawerProps) {

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onKeyDown={() => setIsOpenDrawer(false)}
    >
      <List>
        <ListItem>
          <LanguageSwitcher />
        </ListItem>
      </List>
      <Divider />
      <List>
        {['Home', 'Contact', 'About'].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => setIsOpenDrawer(false)}>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        anchor={'right'}
        open={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      >
        {list()}
      </Drawer>
    </div>
  )
}

export default NavbarDrawer
