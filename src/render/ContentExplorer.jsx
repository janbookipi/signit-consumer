import React, { useState } from "react";
import { ContentExplorer } from "@bookipi/signit-content-explorer";
import { useTranslation } from "react-i18next";

const sessionToken = "";
const lng = "en";

const DUMMY_CLIENT = [
  {
    _id: "67037a158b61eb54c180f1db",
    name: "New Customer With Name Only",
    email: "",
  },
  {
    _id: "6458b048e9ba6d70054c9194",
    name: "Arnaldo Jan_Invalid_Id",
    email: "jan@bookipi.com",
    subtitle: "(candidate)",
  },
  {
    _id: "66fc8c1e2238cc2a9172dc45",
    name: "Hannah Yoo",
    email: "hannah@bookipi.com",
    subtitle: "",
  },
  {
    _id: "66fc8c1e2238cc2a9172dc49",
    name: "Signer Recipient",
    email: "wrtdw.v2.signitrecipient17296722446625@insurance.com",
    subtitle: "(candidate)",
  },
];

// ad-hoc generating of token, for testing
const generateToken = async () => {
  try {
    const response = await fetch("https://signit-dev.bkpi.co/gql", {
      method: "POST",
      headers: {
        "x-application-id": "642268a3a3cc86c205c282c5",
        "x-api-key": "9fsYCPeTvMrGmNFBk8R1dcF28zzQPfNY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation GenerateCustomerCreateSessionKey($customerDetails: customerDetails!, $nonce, $expiry: Date) {
          generateCustomerCreateSessionKey(customerDetails: $customerDetails, nonce: $nonce, expiry: $expiry) {
            token
            expiry
          }
        }`,
        variables: {
          customerDetails: {
            email: "templates@bookipi.com",
            externalId: "66a9b78ca2ced807e88fa493",
            firstName: "Templates",
            lastName: " ",
            companyName: "Bookipi Templates",
          },
        },
      }),
    });

    const data = await response.json();
    if (response.ok && data?.data?.generateCustomerCreateSessionKey?.token) {
      const t = `${data.data.generateCustomerCreateSessionKey.token}`;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return t;
    } else {
      throw new Error("Failed to fetch token");
    }
  } catch (err) {
  } finally {
  }
};

const documentGrouping = {
  homeText: "Customer document",
  selectedGroup: undefined,
  extraViewBy: [
    {
      text: "Customers",
      value: "customers",
      signerNameColumnTitle: "Customer name",
      loadData: async () => {
        return DUMMY_CLIENT;
      },
    },
  ],
};

const defaultPaywall = {
  canCreate: true,
  onShowPaywall: () => alert("Show paywall modal"),
};

const defaultSearchRecipient = async ({ keyword }) => {
  if (!keyword) return DUMMY_CLIENT;

  try {
    return DUMMY_CLIENT.filter(({ name }) =>
      name.toLowerCase().includes(keyword.toLowerCase())
    );
  } catch {
    return [];
  }
};

const RenderContentExplorer = () => {
  const [token, setToken] = useState(sessionToken);

  const { t } = useTranslation();

  return (
    <div className="es-w-full es-px-6 es-py-4 md:es-px-4">
      <ContentExplorer
        lng={lng}
        features={{
          gdrive: true,
        }}
        sessionToken={token}
        documentGenerator={{
          enabled: true,
          description: t("Create and customize AI-powered contracts"),
          onCreateAIDocument: (newDocumentID) => {
            console.log(`Generate an AI contract id: ${newDocumentID}`);
          },
        }}
        documentGrouping={documentGrouping}
        contractVault={{
          enabled: true,
          description: "Upload and store your employee documents in Payroller",
          onCreateVault: (newDocumentId) =>
            console.log(`Upload and Save attachments! id: ${newDocumentId}`),
          recipientTitle: "employee",
          onSearchRecipient: defaultSearchRecipient,
        }}
        paywall={defaultPaywall}
        newUserCtaModal={{
          enabled: true,
          title: "Is your business protected",
          description: "lawyerProtectionMsg",
          cta: {
            type: "service-agreement",
            onCtaAction({ closeModal, newDocumentId }) {
              console.log(
                `New document created from Service Agreement`,
                newDocumentId
              );
              closeModal();
            },
            async onCloseModal() {
              console.log("Manually closing modal after 1 second");
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
              console.log("Do something else");
            },
            // type: 'regular',
            // ctaText: 'Navigate to anywhere',
            // onCtaAction({ closeModal }) {
            //   console.log(`Do anything after clicking primary button`)
            //   closeModal()
            // },
          },
        }}
        modalActions={{
          onModalOpened: () => {
            console.log("Modal has Opened");
          },
          onModalClosed: () => {
            console.log("Modal has Closed");
          },
        }}
        triggers={{
          onSessionExpired: async () => {
            console.log("Session expired, reauthenticate");
            const newToken = await generateToken();
            newToken && setToken(newToken);
          },
          onCreateDocument: (_id) => console.log(`Create document! id: ${_id}`),
          onOpenTemplatePreview: (_id) =>
            console.log(`Preview template! id: ${_id}`),
          onOpenMasterTemplatePreview: (_id) =>
            console.log(`Preview master template! id: ${_id}`),
          onCreateDocumentFromTemplateCompleted: (_id, documentIsAI) =>
            console.log(
              `${
                documentIsAI ? "AI" : ""
              } Document is created from template! id: ${_id}`
            ),
          onEditClick: (_id, type) =>
            console.log(`Edit clicked! id: ${_id}, type: ${type}`),
          onCopySuccess: (_id) =>
            console.log(`Duplicated document! id: ${_id}`),
          onRowClick: (args) => console.log(`Row clicked!`, args),
          onSaveAsTemplateSuccess: (_id) =>
            console.log(`Save template successful! id: ${_id}`),
          onChangeTab: (tab) => console.log(`Tab changed: ${tab}`),
        }}
        learnMoreUrl={"https://bookipi.com/terms-of-service/"}
        noltUrl={"https://bookipi-esign.nolt.io/"}
      />
    </div>
  );
};

export default RenderContentExplorer;
