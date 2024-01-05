// original file to populate FK dropdown on ReleaseOrder

async function getOrderData() {
    const response = await fetch("/orders-json");
    const data = await response.json();
    console.log("here's data", data.data);

    const selectOr = document.getElementById("mySelectAddOrderRO");

    const ordersArray = data.data;


    for (let index = 0; index<ordersArray.length; index++){
        let ordersOption = document.createElement("option");
        let orders = ordersArray[index];

        ordersOption.value = orders.orderID;
        ordersOption.text = orders.orderID;
        selectOr.appendChild(ordersOption);
        
    }

    const OrdersSelect = document.getElementById("mySelectReleaseOrderUpdateOrder");

    if (OrdersSelect !== null){
        for (let index = 0; index<ordersArray.length; index++){
            let ordersOption = document.createElement("option");
            let orders = ordersArray[index];

            ordersOption.value = orders.orderID;
            ordersOption.text = orders.orderID;
            OrdersSelect.appendChild(ordersOption);
            
        }
    }
}

getOrderData();