import {
  Fab,
  Tooltip,
  Stack,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import CloseIcon from "@mui/icons-material/Close";
import "./main.css";
import { useState, useEffect, useMemo } from "react";
import ReactWebChat, { createDirectLine } from "botframework-webchat";
import DocImage from "./assets/Doc.png"
import UserImage from "./assets/User.png"

function App() {
  const [isOpenChat, setIsOpenChat] = useState(false);

  const [token, setToken] = useState(null);

  useEffect(() => {
    // Llamar a tu backend para obtener el Direct Line Token
    fetch(
      "https://defaulteceb89e794574a4eb85f8da553d2f8.b9.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr528_copilot/directline/token?api-version=2022-03-01-preview"
    )
      .then((response) => response.json())
      .then((data) => setToken(data.token));
  }, []);

  const directLine = useMemo(() => {
    if (!token) {
      return null;
    } else {
      return createDirectLine({ token });
    }
  }, [token, isOpenChat]);

  const styleOptions = {
    accent: "#141414",
    hideUploadButton: true,
    botAvatarInitials: "BF",
    botAvatarImage: DocImage,
    userAvatarImage: UserImage,
    userAvatarInitials: "dd",
    // backgroundColor: "#F0F0F0",
    // bubbleBackground: "#e0f7fa",
    // bubbleTextColor: "#000",
    // bubbleBorderColor: "#008080",
  };

  const sendConversationStartEvent = (dl) => {
    dl.postActivity({
      locale: "es-es",
      type: "event",
      name: "startConversation", // Evento para iniciar la conversación
      value: {
        UserName: "Dany", // Inicializando UserName
        Email: "danyherzdev@gmail.com", // Inicializando UserEmail
      },
    }).subscribe(
      (id) => console.log(`Evento de conversación iniciado con ID: ${id}`),
      (error) => console.error("Error iniciando la conversación", error)
    );
  };

  useEffect(() => {
    if (directLine) {
      sendConversationStartEvent(directLine); // Iniciar la conversación
    }
  }, [directLine]);

  return (
    <>
      <h2>Sandbox</h2>
      <Box sx={{ position: "fixed", bottom: "16px", right: "16px " }}>
        <Tooltip
          title="Chatea con soporte"
          placement="top-start"
          sx={{ ...(isOpenChat && { display: "none" }) }}
        >
          <Fab color="error" onClick={() => setIsOpenChat(true)}>
            <ContactSupportIcon fontSize="large" />
          </Fab>
        </Tooltip>
        <Stack
          sx={{
            ...(!isOpenChat && { display: "none" }),
            height: "550px",
            width: "400px",
            p: 1,
            borderRadius: 1,
            backgroundColor: "divider",
            boxShadow:
              "0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
          }}
        >
          <Stack direction="row-reverse">
            <IconButton>
              <CloseIcon onClick={() => setIsOpenChat(false)} />
            </IconButton>
          </Stack>
          {directLine && (
            <Box sx={{ height: "94%", width: "100%" }}>
              <Stack sx={{ py: 1, pl: 1, backgroundColor: "primary.main", color: "primary.contrastText" }}>
                <Typography variant="body1">
                  Agente virtual - DocSolutions
                </Typography>
              </Stack>
              <Box sx={{ height: "90%", width: "100%" }}>
                <ReactWebChat
                  directLine={directLine}
                  styleOptions={styleOptions}
                />
              </Box>
            </Box>
          )}
        </Stack>
      </Box>
    </>
  );
}

export default App;
