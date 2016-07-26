import NoteStore from '../../stores/NoteStore';
import LaneStore from '../../stores/LaneStore';
import storage   from '../../libs/storage';
import persist   from '../../libs/persist';


export default alt => {
  alt.addStore('NoteStore', NoteStore);
  alt.addStore('LaneStore', LaneStore);

  persist(alt, storage(localStorage), 'app');
}
