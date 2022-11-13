import {
  Pie,
  PieChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
} from "recharts";
import { Row, Col, Card, Container } from "react-bootstrap";

import { VscDebugBreakpointData } from "react-icons/vsc";
import axios from "axios";
import { API_URL } from "../../connection/ConnectionSetup";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const colors = ["#00ABB3", "#8BBCCC", "#4C6793", "#5C2E7E", "#000000"];

  const [pageIndex, setPageIndex] = useState(1);
  const [orders, setOrders] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState([]);

  const fetchOrderData = async () => {
    await axios.get(API_URL + "/Orders/getorderstatistic").then((response) => {
      setOrders(response.data);
    });
  };

  const fetchIncomeData = async () => {
    await axios
      .get(API_URL + "/Orders/getmonthlystatistic")
      .then((response) => {
        for (const key in response.data.monthlyIncome) {
          setMonthlyIncome((month) => {
            return [
              ...month,
              { month: key, amount: response.data.monthlyIncome[key] },
            ];
          });
        }
      });
  };

  useEffect(() => {
    console.log("rerender");
    fetchOrderData();
    fetchIncomeData();
    setMonthlyIncome([]);
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card style={{ margin: "24px" }}>
            <Card.Header>Orders Statistic</Card.Header>
            <Card.Body>
              <ResponsiveContainer height={500}>
                <PieChart>
                  <Pie
                    data={orders}
                    dataKey="amount"
                    name="type"
                    outerRadius={100}
                    label
                  >
                    {orders.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
            <Card.Footer>
              {orders.map((entry, index) => {
                return (
                  <>
                    <VscDebugBreakpointData style={{ color: colors[index] }} />
                    {entry.type}
                  </>
                );
              })}
            </Card.Footer>
          </Card>
        </Col>
        <Col>
          <Card style={{ margin: "24px" }}>
            <Card.Header>Monthly Income Statistic</Card.Header>
            <Card.Body>
              <ResponsiveContainer height={500}>
                <LineChart
                  width={730}
                  height={250}
                  data={monthlyIncome}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
            <Card.Footer></Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
