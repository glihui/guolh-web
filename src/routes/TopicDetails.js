import React from 'react';
import { connect } from 'dva';

import MainLayout from '../components/MainLayout/MainLayout';
import TopicDetailsPage from '../components/TopicDetails/TopicDetails';

function TopicDetails ({ location }){
  return (
    <MainLayout location={location}>
      <div>
        <TopicDetailsPage/>
      </div>
    </MainLayout>
  )
}

TopicDetails.propTypes = {
};

export default connect()(TopicDetails);
