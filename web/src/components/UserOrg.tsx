import * as React from 'react';
import { Box, Stack, Typography, Avatar, Link, Divider } from '@mui/material';
import {
    AccountPreview,
    AccountPopoverFooter,
    SignOutButton,
    Account,
} from '@toolpad/core/Account';
import { CustomSession, useSession } from './SessionContext'

function test() {
    const session = useSession();
    if (!session?.session?.user) {
        return <Typography>No user session available</Typography>;
    }

    // const { logo: orgLogo, name: orgName, url: orgUrl } = session.session?.org;
    // return (
    //     <Stack>
    //         <AccountPreview variant="expanded" />
    //         {session.session?.org && (
    //             <Stack mb={1}>
    //                 <Typography textAlign="center" fontSize="1rem" gutterBottom>
    //                     {session?.session?.admin && <div>Admin</div>}
    //                 </Typography>
    //                 {/* <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
    //                     <Avatar
    //                         variant="square"
    //                         src={orgLogo}
    //                         alt={orgName}
    //                         sx={{ width: 27, height: 24 }}
    //                     />
    //                     <Stack>
    //                         <Typography variant="caption" fontWeight="bolder">
    //                             {orgName}
    //                         </Typography>
    //                         <Link
    //                             variant="caption"
    //                             href={orgUrl}
    //                             target="_blank"
    //                             rel="noopener noreferrer"
    //                         >
    //                             {orgUrl}
    //                         </Link>
    //                     </Stack>
    //                 </Box> */}
    //             </Stack>
    //         )}
    //         <Divider />
    //         <AccountPopoverFooter>
    //             <SignOutButton />
    //         </AccountPopoverFooter>
    //     </Stack>)
}
export function UserOrg() {
    return (
        <Account
            slots={{
                popoverContent: test,
            }}
        />);
}
