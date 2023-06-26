import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { expenseDataType } from "../../redux/expanseSlice";
import { Rootstate } from "../../redux/store";
import { GeneralPropType } from "../../routes/AuthRoutes";
interface PropType extends GeneralPropType {
  groupName: string;
}
function GroupWiseSetttlement({ groupName, userData }: PropType) {
  const { expenseList } = useSelector(
    (state: Rootstate) => state.expenseReducer
  );
  const [activeGroupExpense, setActiveGroupExpenseList] =
    useState<expenseDataType[]>();
  const [payAmount, setPayAmount] = useState(0);
  const [getAmount, setGetAmount] = useState(0);
  useEffect(() => {
    const activeGroupExpenseList: expenseDataType[] = [];
    let paidAmount = 0;
    let tempgetAmount = 0;
    expenseList.forEach((expense) => {
      if (expense.group_list?.indexOf(groupName) >= 0) {
        if (
          !expense.isSettle &&
          expense.member_list != undefined &&
          expense.member_list.length > 1
        ) {
          if (expense.paid_by == userData?.email) {
            tempgetAmount =
              tempgetAmount +
              (expense.expense_amount -
                expense.expense_amount / expense.member_list.length);
          } else {
            paidAmount =
              paidAmount + expense.expense_amount / expense.member_list.length;
          }
          activeGroupExpenseList.push(expense);
          setPayAmount(paidAmount);
          setGetAmount(tempgetAmount);
        }
      }
    });
    setActiveGroupExpenseList(activeGroupExpenseList);
  }, []);

  return (
    <>
      {payAmount - getAmount > 0 ? (
        <Typography color={"darkred"} fontWeight={"bold"}>
          You should pay {payAmount - getAmount} INR
        </Typography>
      ) : (
        <Typography color={"lightgreen"} fontWeight={"bold"}>
          You owe {getAmount - payAmount} INR
        </Typography>
      )}
    </>
  );
}

export default GroupWiseSetttlement;
