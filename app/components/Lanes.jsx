import React from 'react';
import Lane from './Lane';
import LaneActions from '../actions/LaneActions';

export default ({lanes}) => (
  <div className="lanes">{lanes.map(lane =>
    <Lane className="lane" onMove={LaneActions.laneMove}
          key={lane.id} lane={lane} />
  )}</div>
)
