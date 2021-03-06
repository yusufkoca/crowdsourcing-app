import { Button, TextField } from "@material-ui/core";
import React, { ReactElement } from "react";
import Cards, { Focused } from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import MaskedTextInput from "./MaskedTextInput";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useConstants } from "../../providers/ConstantsContext";
import { Donor } from "../../types/Donation";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

type PaymentFormProps = {
  handlePaymentDone: (donationAmount: number, donor: Donor) => void;
};

const PaymentForm = ({ handlePaymentDone }: PaymentFormProps): ReactElement => {
  const classes = useStyles();
  const { targetDonationCurrency } = useConstants();
  const { enqueueSnackbar } = useSnackbar();

  const [donorName, setDonorName] = React.useState("");
  const [donorEmail, setDonorEmail] = React.useState("");
  const [donationAmount, setDonationAmount] = React.useState(10);
  const [cvc, setCvc] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [focus, setFocus] = React.useState<Focused>("number");
  const [name, setName] = React.useState("");
  const [number, setNumber] = React.useState("");

  function checkFormValidity() {
    // A library like formik should be used here but for simplicity we only check required fields
    // Also for credit card info there should be a strict validation

    if (donorName && cvc && expiry && focus && name && number) {
      return true;
    }
    return false;
  }

  function isOfTypeFocused(keyInput: string): keyInput is Focused {
    return ["number", "name", "expiry", "cvc"].includes(keyInput);
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isOfTypeFocused(e.target.name)) {
      setFocus(e.target.name);
    }
  };

  return (
    <div id="PaymentForm">
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          name="donorName"
          id="donorName"
          label={"Your Name"}
          variant="outlined"
          value={donorName}
          onChange={(e) => {
            setDonorName(e.target.value);
          }}
          fullWidth
          required
        />
        <TextField
          name="donorEmail"
          id="donorEmail"
          label={"Your Email"}
          variant="outlined"
          value={donorEmail}
          onChange={(e) => {
            setDonorEmail(e.target.value);
          }}
          fullWidth
        />
        <TextField
          name="donationAmount"
          id="donationAmount"
          label={"Donation Amount in " + targetDonationCurrency}
          variant="outlined"
          type="number"
          value={donationAmount}
          onChange={(e) => {
            setDonationAmount(parseInt(e.target.value, 10));
          }}
          fullWidth
          required
        />

        <Cards
          cvc={cvc}
          expiry={expiry}
          name={name}
          number={number}
          focused={focus}
        />

        <TextField
          name="number"
          id="number"
          label="Card Number"
          variant="outlined"
          onChange={(e) => {
            setNumber(e.target.value.replaceAll("-", ""));
          }}
          onFocus={handleInputFocus}
          InputProps={{
            inputComponent: MaskedTextInput as any,
            inputProps: {
              mask: [
                /[1-9]/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ],
            },
          }}
          fullWidth
          required
        />
        <TextField
          name="name"
          id="name"
          label="Full Name"
          variant="outlined"
          onChange={(e) => {
            setName(e.target.value);
          }}
          onFocus={handleInputFocus}
          fullWidth
          required
        />
        <div style={{ display: "flex" }}>
          <TextField
            name="expiry"
            id="expiry"
            label="Expiration Date"
            variant="outlined"
            onChange={(e) => {
              setExpiry(e.target.value.replaceAll("/", ""));
            }}
            onFocus={handleInputFocus}
            InputProps={{
              inputComponent: MaskedTextInput as any,
              inputProps: {
                mask: [/[1-9]/, /\d/, "/", /\d/, /\d/],
              },
            }}
            required
            style={{ marginLeft: 0 }}
          />
          <TextField
            name="cvc"
            id="cvc"
            label="CVC"
            variant="outlined"
            onChange={(e) => {
              setCvc(e.target.value);
            }}
            onFocus={handleInputFocus}
            InputProps={{
              inputComponent: MaskedTextInput as any,
              inputProps: {
                mask: [/[1-9]/, /\d/, /\d/],
              },
            }}
            required
            style={{ marginRight: 0 }}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (checkFormValidity()) {
              // BANK API call here and if successfull call handlePaymentDone function
              handlePaymentDone(donationAmount, {
                name: donorName,
                email: donorEmail,
              });
            } else {
              enqueueSnackbar("Please fill all required fields", {
                variant: "error",
              });
            }
          }}
        >
          Donate
        </Button>
      </form>
    </div>
  );
};

export default PaymentForm;
