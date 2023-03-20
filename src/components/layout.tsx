import { Box } from "@chakra-ui/react";

const Layout = ({ children, className }: { children: React.ReactNode; className: string }) => {
  return (
    <Box className={className} data-test="app-layout">
      {children}
    </Box>
  );
};

export default Layout;
