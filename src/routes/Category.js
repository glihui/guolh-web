import React from 'react';
import { connect } from 'dva';

import MainLayout from '../components/MainLayout/MainLayout';
import CategoryPage from '../components/Category/Category';

function Category ({ location }){
  return (
    <MainLayout location={location}>
      <div>
        <CategoryPage/>
      </div>
    </MainLayout>
  )
}

Category.propTypes = {
};

export default connect()(Category);
