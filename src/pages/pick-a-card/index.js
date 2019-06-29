import React from 'react';
import { Query } from "react-apollo";

import Loader from '../../shared-components/loader';
import { SEARCH_QUERY } from '../../operations/queries';
import './index.css';

export default ({ id }) => (
	<Query query={SEARCH_QUERY} variables={{ type: 'PICKACARD' }}>
		{({ loading, error, data }) => {
      if (loading) return <Loader />;
			if (error) return `Error! ${error.message}`;
			
			return <div
				style={{
					width: "100vw",
					height: "50vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					color: "#30e29f",
				}}
			>COMING SOON. CHECK BACK IN FEW DAYS.</div>
    }}
	</Query>
)
