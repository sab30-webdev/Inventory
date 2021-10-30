import { Button, Form, Modal } from "react-bootstrap";
import { useState, useRef } from "react";
import { ref, set, push } from "firebase/database";

const Invoice = ({ data, db, uid }) => {
  const [show, setShow] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [current, setCurrent] = useState(null);

  const selectRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelect = (e) => {
    const p = data.filter((d) => d.pid === e.target.value);
    setPrice(p[0].Price);
    setCurrent(p[0]);
    setQuantity(0);
  };

  const incQuantity = () => {
    // eslint-disable-next-line
    if (selectRef.current.value != 0) {
      if (quantity < current.Qty) {
        setQuantity(quantity + 1);
      }
    }
  };

  const decQuantity = () => {
    // eslint-disable-next-line
    if (selectRef.current.value != 0) {
      if (quantity - 1 > 0) {
        setQuantity(quantity - 1);
      }
    }
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const generateInvoice = () => {
    // eslint-disable-next-line
    if (selectRef.current.value != 0) {
      // Generating Invoice
      let invoice = {};
      invoice["Name"] = current.Name;
      invoice["Qty"] = quantity;
      invoice["Price"] = price * quantity;
      set(push(ref(db, "users/" + uid + "/invoices")), invoice);

      // Updating Inventory
      const newQuantity = current.Qty - quantity;
      const qtyRef = ref(
        db,
        "users/" + uid + "/inventory/" + current.pid + "/Qty"
      );
      set(qtyRef, newQuantity);

      setQuantity(0);
      setPrice(0);
      setCurrent(null);
    }
  };

  return (
    <>
      <h1 className="mx-3 mt-3">Generate Invoice</h1>
      <Button onClick={handleShow} className="mx-3 my-3">
        New Order
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label className="me-sm-2" htmlFor="select">
              Choose a product
            </Form.Label>
            <Form.Select
              className="me-sm-2"
              id="select"
              onChange={handleSelect}
              ref={selectRef}
            >
              <option value={0}>Choose...</option>
              {data.map((d) => (
                <option key={d.pid} value={d.pid}>
                  {d.Name}
                </option>
              ))}
            </Form.Select>
            <Form.Group className="mt-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control value={quantity} name="quantity" readOnly />{" "}
              <div className="mt-3">
                <Button onClick={incQuantity}>+</Button>{" "}
                <Button onClick={decQuantity}>-</Button>
              </div>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                value={price * quantity}
                onChange={handlePrice}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              generateInvoice();
              handleClose();
            }}
          >
            Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Invoice;
