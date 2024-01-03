import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminContentWrapper from "../../components/AdminContentWrapper";
import PageH1Title from "../../components/PageH1Title";
import BackButtonWithArrow from "../../components/BackButtonWithArrow";
import StatisticsCard from "../../components/StatisticsCard";
import { collection, getDocs, query } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase-config";
import { PulseLoader } from "react-spinners";
import CustomButton from "../../components/CustomButton";

// Udviklet fælles i gruppen

function Statistics() {
  const [allOrders, setAllOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderPrice, setAverageOrderPrice] = useState(0);
  const [popularProducts, setPopularProducts] = useState([]);
  const [cancelPercentage, setCancelPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const getAllOrders = async () => {
      const storedOrders = JSON.parse(localStorage.getItem("allOrders"));
      const storedTimestamp = localStorage.getItem("ordersTimestamp");

      if (storedOrders && storedTimestamp && Date.now() - storedTimestamp < 5 * 60 * 1000) {
        setAllOrders(storedOrders);
        setLoading(false);
      } else {
        const newOrders = [];
        const q = query(collection(FIREBASE_DB, "orders"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          newOrders.push(doc.data());
        });
        setAllOrders(newOrders);
        localStorage.setItem("allOrders", JSON.stringify(newOrders));
        localStorage.setItem("ordersTimestamp", Date.now().toString());
      }
    };

    getAllOrders();
  }, []);

  useEffect(() => {
    const getAnalytics = async () => {
      if (allOrders.length > 0) {
        await getTotalRevenue();
        await getAverageOrderValue();
        await generatePopularProducts();
        await getCancelPercentage();
      }
    };
    getAnalytics();
  }, [allOrders]);

  const getTotalRevenue = async () => {
    let totalRevenue = 0;
    allOrders.forEach((order) => {
      if (order.status === "shopCancelled" || order.status === "userCancelled") {
        return;
      }
      order?.order?.forEach((item) => {
        totalRevenue += item.price;
      });
    });
    setTotalRevenue(totalRevenue);
    setLoading(false);
  };

  const getAverageOrderValue = async () => {
    if (allOrders) {
      let totalValue = 0;

      allOrders.forEach((order) => {
        order?.order?.forEach((item) => {
          totalValue += item.price;
        });
      });

      const averageOrder = totalValue / (allOrders.length - 1);

      setAverageOrderPrice(averageOrder);
    }
    setLoading(false);
  };

  const generatePopularProducts = async () => {
    const allProductsOrdered = [];
    allOrders.forEach((order) => {
      order?.order?.forEach((item) => {
        allProductsOrdered.push(item.name);
      });
    });

    let productsCounted = allProductsOrdered.reduce(function (value, value2) {
      return value[value2] ? ++value[value2] : (value[value2] = 1), value;
    }, {});

    const entries = Object.entries(productsCounted);

    const productsSorted = entries.sort((a, b) => b[1] - a[1]);

    setPopularProducts(productsSorted);
  };

  const getCancelPercentage = async () => {
    if (allOrders.length > 0) {
      const cancelledOrders = allOrders.filter(
        (order) => order.status === "userCancelled" || order.status === "shopCancelled"
      );
      const totalCancelled = cancelledOrders.length;
      const totalOrders = allOrders.length;
      const percentage = (totalCancelled / totalOrders) * 100;
      setCancelPercentage(percentage);
    } else {
      setCancelPercentage(0);
    }
  };

  const refreshFromFirestore = async () => {
    setLoading(true);
    const newOrders = [];
    const q = query(collection(FIREBASE_DB, "orders"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      newOrders.push(doc.data());
    });
    setAllOrders(newOrders);
    localStorage.setItem("allOrders", JSON.stringify(newOrders));
    localStorage.setItem("ordersTimestamp", Date.now().toString());
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <AdminSidebar />
        <AdminContentWrapper>
          <BackButtonWithArrow linkText="Tilbage til ordre oversigt" linkTo="/ordre-oversigt" />
          <PageH1Title>Ordre Statistik</PageH1Title>
          <p>Her kan du se statistik om kundernes brug af hjemmesiden, hvilke produkter der klarer sig bedst mm.</p>
          <div className="mt-5 w-[250px]">
            <CustomButton
              title="Hent nyeste data"
              icon="fa-solid fa-rotate"
              iconRight={true}
              function={refreshFromFirestore}
            />
          </div>
          <div className="flex flex-wrap gap-5 mt-8">
            <div className="flex flex-col flex-wrap gap-5">
              <div className="flex flex-wrap gap-5">
                <StatisticsCard
                  property="Ordrer i alt"
                  value={`${allOrders.length - 1} stk.`}
                  bigText={true}
                  loading={loading}
                />
                <StatisticsCard
                  property="Omsætning til dato"
                  value={`${Intl.NumberFormat("da-DK", {
                    style: "currency",
                    currency: "DKK",
                    maximumFractionDigits: 0,
                    roundingMode: "halfCeil",
                  }).format(totalRevenue)}`}
                  loading={loading}
                />
              </div>
              <div className="flex flex-col min-h-fit rounded-xl p-5 bg-dark text-white min-w-fit">
                <h2 className="font-semibold">Mest populære produkter</h2>
                {loading ? (
                  <div className="text-center">
                    <PulseLoader color="#ffffff" size={13} />
                  </div>
                ) : (
                  <ul className="list-decimal list-inside whitespace-nowrap mt-3">
                    {popularProducts.map((product, key) => {
                      return (
                        <div key={key} className="flex gap-3 items-center">
                          <li className="py-1">{product[0]}</li>
                          <hr className="border-1 w-full border-dashed" />
                          <p>
                            <b>{product[1]}</b> stk. solgt
                          </p>
                        </div>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-5 flex-wrap xl:flex-col">
              <StatisticsCard
                property="Gennemsnits ordreværdi"
                value={`${Intl.NumberFormat("da-DK", {
                  style: "currency",
                  currency: "DKK",
                  maximumFractionDigits: 1,
                }).format(averageOrderPrice)}`}
                loading={loading}
              />
              <StatisticsCard
                property="Anullerings procent"
                value={`${cancelPercentage.toFixed(1)}%`}
                loading={loading}
              />
            </div>
          </div>
        </AdminContentWrapper>
      </div>
    </>
  );
}

export default Statistics;
