import React, { useState, useEffect } from 'react';
// import DatePicker from 'react-datepicker'; 
// import 'react-datepicker/dist/react-datepicker.css'; 
import {
    Box,
    Typography,
    ButtonGroup,
    Button,
    Grid
} from '@mui/material';
import { DatePicker,DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const App = () => {
  const [followers, setFollowers] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [dateRange, setDateRange] = useState([]);

  const handleDateRangeChange = (value) => {
    if(value){
    setDateRange(value);
    }else{
        setDateRange([])
    }
  };

 

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(
          'https://gist.githubusercontent.com/pandemonia/21703a6a303e0487a73b2610c8db41ab/raw/82e3ef99cde5b6e313922a5ccce7f38e17f790ac/twubric.json'
        );
        const data = await response.json();
        setFollowers(data);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, []);

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };
  

  const handleRemoveFollower = (followerId) => {
    setFollowers(followers.filter((follower) => follower.uid !== followerId));
  };

  const filteredFollowers = followers.filter((follower) => {
    const joinDate = new Date(follower?.join_date * 1000); // Convert Unix timestamp to milliseconds

    if (dateRange.length === 2) {
      const fromDate = new Date(dateRange[0]);
      const toDate = new Date(dateRange[1]);
      return joinDate >= fromDate && joinDate <= toDate;
    }
    return true;
  });

  const sortedFollowers = sortBy
    ? filteredFollowers.sort((a, b) => {
        const aValue = a.twubric && a.twubric[sortBy];
        const bValue = b.twubric && b.twubric[sortBy];

        if (sortOrder === 'asc') {
          return (aValue || 0) - (bValue || 0);
        } else {
          return (bValue || 0) - (aValue || 0);
        }
      })
    : filteredFollowers;

  return (
    <Box  className="app">
    <Box className='box'>
      <Typography 
                    className='Twitter'>Twitter Followers</Typography>
                    <Grid lg={6} md={6} sm={12} xs={12}>
      <Box className="filters">
      <Box className='sort'>
        <Typography variant='span' className='sort-by'>Sort By:</Typography>
        <Box className='filter-buttons'>
        <Button variant='contained'  onClick={() => handleSort('total')}>Twubric Score</Button>
        <Button variant='contained' onClick={() => handleSort('friends')}>Friends</Button>
        <Button variant='contained' onClick={() => handleSort('influence')}>Influence</Button>
        <Button variant='contained' onClick={() => handleSort('chirpiness')}>Chirpiness</Button>
        </Box>
        </Box>
        <Box className='DateRange'>
        <Typography variant='span' className='sort-by'>Joined Twitter between:</Typography>
        {/* <DatePicker
                                                        oneTap value={fromDate} onChange={date => setFromDate(date)} />
        <DatePicker
                                                        oneTap value={toDate} onChange={date => setToDate(date)} /> */}

<DateRangePicker
                showOneCalendar
                placeholder="Select Date Range"
                className="modal-date-picker"
                format="dd-MM-yyyy"
                onChange={handleDateRangeChange}
               ></DateRangePicker>
        </Box>
      </Box>
      </Grid>
      <Grid container spacing={2}>
  {sortedFollowers.map((follower) => (
    <Grid key={follower.uid} item lg={3} md={3} xs={6} sm={12}>
      <Box className="follower-item">
        <Typography variant='div'>Username: {follower.username}</Typography>
        <Typography variant='div'>Twubric Score: {follower.twubric.total}</Typography>
        <Typography variant='div'>Friends: {follower.twubric.friends}</Typography>
        <Typography variant='div'>Influence: {follower.twubric.influence}</Typography>
        <Typography variant='div'>Chirpiness: {follower.twubric.chirpiness}</Typography>
        <Button variant='contained' className='remove-button' onClick={() => handleRemoveFollower(follower.uid)}>Remove</Button>
      </Box>
    </Grid>
  ))}
</Grid>

    </Box>
    </Box>
  );
};

export default App;
