import { useSnackbar } from '@/providers/SnackbarProvider';
import { Group as AdminsIcon, Assignment as AuditIcon, Payment as BillingIcon, Business as BusinessIcon, Dashboard as DashboardIcon, Security as FirewallIcon, DirectionsBoat as FleetIcon, Wifi as HotspotIcon, Inbox as InboxIcon, Logout as LogoutIcon, Mail as MailIcon, Router as RouterIcon } from '@mui/icons-material';
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

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  minHeight: 48,
  marginLeft: 10,
  marginRight: 10,
  borderRadius: 8,
  transition: 'all 0.2s ease-in-out',
  '&:not(.Mui-disabled):hover': {
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
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
      '& .MuiListItemIcon-root': {
        color: 'inherit !important',
      },
      '& .MuiListItemText-primary': {
        color: 'inherit !important',
      }
    }
  }
}));

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, selected: true, navigate: '/home' },
  { text: 'Tenants', icon: <BusinessIcon />, disabled: true },
  { text: 'Fleets', icon: <FleetIcon />, disabled: true },
  { text: 'Routers', icon: <RouterIcon />, disabled: true },
  { text: 'Firewall Templates', icon: <FirewallIcon />, disabled: true },
  { text: 'Hotspot Users', icon: <HotspotIcon />, disabled: true },
  { text: 'Audit Trail', icon: <AuditIcon />, navigate: '/audit-trail' },
  { text: 'Billing', icon: <BillingIcon />, disabled: true },
  { text: 'Admins', icon: <AdminsIcon />, disabled: true }
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
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    showSnackbar('Logged out successfully', 'success');
    router.push('/');
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
                if (item.navigate && !item.disabled) {
                  router.push(item.navigate);
                }
              }}
              disabled={item.disabled}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-disabled': {
                  cursor: 'not-allowed',
                  '&:hover': {
                    backgroundColor: 'transparent !important',
                  }
                }
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

      

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <StyledListItemButton
              disabled={true}
              sx={{
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-disabled': {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  backgroundColor: 'transparent !important',
                  '&:hover': {
                    backgroundColor: 'transparent !important',
                  }
                }
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
          <StyledListItemButton 
            onClick={handleLogout}
            disabled={false}
            sx={{
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              '&.Mui-disabled': {
                opacity: 0.5,
                cursor: 'pointer',
                backgroundColor: 'transparent !important',
                '&:hover': {
                  backgroundColor: 'transparent !important',
                }
              }
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
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{
                opacity: open ? 1 : 0,
                color: 'inherit'
              }}
            />
          </StyledListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

