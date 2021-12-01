import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useRouter } from 'next/router';

// function LinkTab(props) {
//   return (
//     <Tab
//       component='a'
//       onClick={(event) => {
//         event.preventDefault();
//       }}
//       {...props}
//     />
//   );
// }
function PopularityTab(props) {
  const router = useRouter();
  return (
    <Tab
      component='a'
      onClick={(event) => {
        event.preventDefault();
        router.push(props.href);
      }}
      {...props}
    />
  );
}
function NewestTab(props) {
  const router = useRouter();
  return (
    <Tab
      component='a'
      onClick={(event) => {
        event.preventDefault();
        router.push(props.href);
      }}
      {...props}
    />
  );
}

export default function NavTabs({ keyword, tab }) {
  const router = useRouter();
  const [value, setValue] = React.useState(tab);

  const handleChange = (event, newValue) => {
    // event.preventDefault();
    setValue(newValue);
    if (newValue === 0) {
      router.push(`/search?keyword=${keyword}`);
    } else if (newValue === 1) {
      router.push(`/search?keyword=${keyword}&order=newest`);
    }
  };

  return (
    <Box sx={{ width: '100%', marginBottom: '20px' }}>
      <Tabs value={value} onChange={handleChange} variant='fullWidth' aria-label='nav tabs example'>
        <PopularityTab label='Popularity' href={`/search?keyword=${keyword}`} />
        <NewestTab label='Newest' href={`/search?keyword=${keyword}&order=newest`} />
        {/* <LinkTab label='Page Three' /> */}
      </Tabs>
    </Box>
  );
}
