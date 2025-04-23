import { useSnackbar } from '@/providers/SnackbarProvider';
import { Group as AdminsIcon, Assignment as AuditIcon, Payment as BillingIcon, Business as BusinessIcon, Dashboard as DashboardIcon, Security as FirewallIcon, DirectionsBoat as FleetIcon, Wifi as HotspotIcon, Logout as LogoutIcon, Router as RouterIcon } from '@mui/icons-material';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, Theme, styled, useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect, useState } from 'react';
const drawerWidth = 240;
const miniDrawerWidth = 65;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  height: '100%',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: miniDrawerWidth,
  height: '100%',

});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const StyledListItemButton = styled(ListItemButton)(({  }) => ({
  minHeight: 48,
  marginLeft: 10,
  marginRight: 10,
  borderRadius: 8,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#4DABF7 !important',
    '& .MuiListItemIcon-root': {
      color: '#fff !important',
    },
    '& .MuiListItemText-primary': {
      color: '#fff !important',
    }
  },
  '&.Mui-selected': {
    backgroundColor: '#4DABF7',
    '& .MuiListItemIcon-root': {
      color: '#fff',
    },
    '& .MuiListItemText-primary': {
      color: '#fff',
    }
  }
}));

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, selected: true, navigate: '/home' },
  { text: 'Tenants', icon: <BusinessIcon /> },
  { text: 'Fleets', icon: <FleetIcon /> },
  { text: 'Routers', icon: <RouterIcon /> },
  { text: 'Firewall Templates', icon: <FirewallIcon /> },
  { text: 'Hotspot Users', icon: <HotspotIcon /> },
  { text: 'Audit Trail', icon: <AuditIcon />, navigate: '/audit-trail' },
  { text: 'Billing', icon: <BillingIcon /> },
  { text: 'Admins', icon: <AdminsIcon /> }
];


export default function DrawerComponent() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const router = useRouter();
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    showSnackbar('Logged out successfully', 'success');
    router.push('/login');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      open={open}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      PaperProps={{
        sx: {
          backgroundColor: "#183b65",
          borderRight: `1px solid ${theme.palette.divider}`,
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          color: theme.palette.text.primary,
        }}
      >
        <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>{open? 'future' : "f"}</Typography>
        <Typography component="span" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: '1.8rem' }}>{open? 'konnect' : "k"}</Typography>
      </Typography>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <StyledListItemButton
              selected={item.navigate === pathname}
              onClick={() => {
                if (item.navigate) {
                  router.push(item.navigate);
                }
              }}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  color: 'inherit'
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <StyledListItemButton
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit'
                }}
              >
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{
                  opacity: open ? 1 : 0,
                  color: 'inherit'
                }}
              />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: theme.palette.divider }} />
      <List>
        <ListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
              <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

