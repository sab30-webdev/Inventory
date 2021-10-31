import { Button } from "react-bootstrap";
import { getDatabase, ref, set } from "firebase/database";

const Item = ({ data: { pid, Name, Price, Qty }, idx, uid }) => {
  const db = getDatabase();

  const handleDelete = () => {
    const itemRef = ref(db, `users/${uid}/inventory/${pid}`);
    set(itemRef, null);
  };

  return (
    <tr>
      <td>{idx}</td>
      <td>{Name}</td>
      <td>{Qty}</td>
      <td>{Price}</td>
      <td>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default Item;
