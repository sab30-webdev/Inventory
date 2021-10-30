import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Invoice from "./Invoice";
import { Form, Button } from "react-bootstrap";

import Item from "./Item";

const Inventory = ({ uid }) => {
  const db = getDatabase();
  const [data, setData] = useState({ Name: "", Qty: "", Price: "" }); // Data to be added to the database
  const [invData, setInvData] = useState([]); // Inventory data fetched from the database

  useEffect(() => {
    const userInventoryRef = ref(db, "users/" + uid + "/inventory");
    onValue(userInventoryRef, (snapshot) => {
      const data = snapshot.val();
      let list = [];
      for (let key in data) {
        list.unshift({ pid: key, ...data[key] });
      }
      setInvData(list);
    });
  }, [db, uid]);

  const add = () => {
    const invenListRef = ref(db, "users/" + uid + "/inventory");
    const newInvenRef = push(invenListRef);
    set(newInvenRef, data);
    setData({ Name: "", Qty: "", Price: "" });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="inventory">
      <h1 className="m-3">My Inventory</h1>
      <div className="add-item m-3">
        <Form.Control
          type="text"
          name="Name"
          placeholder="ItemName"
          value={data.Name}
          onChange={handleChange}
          className="control-width"
        />
        <Form.Control
          className="mt-3 control-width"
          type="text"
          name="Qty"
          placeholder="Quantity"
          value={data.Qty}
          onChange={handleChange}
        />
        <Form.Control
          className="my-3 control-width"
          type="text"
          name="Price"
          placeholder="Price"
          value={data.Price}
          onChange={handleChange}
        />
        <Button variant="success" onClick={add}>
          Add item
        </Button>
      </div>
      <div>
        <Table striped bordered hover variant="dark" className="table m-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {invData.length !== 0 &&
              invData.map((d, i) => (
                <Item key={d.pid} data={d} idx={i} uid={uid} />
              ))}
          </tbody>
        </Table>
      </div>
      <div className="invoice">
        <Invoice data={invData} db={db} uid={uid} />
      </div>
    </div>
  );
};

export default Inventory;
