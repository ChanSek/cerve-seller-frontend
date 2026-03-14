import React from "react";
import { Grid, Card, CardContent, Typography, Box, Divider, Stack } from "@mui/material";
import dayjs from "dayjs";

const InvoiceCard = ({ billing, mainDelivery }) => (
  <Box>
    <Grid container spacing={3}>
      {/* Billing Address */}
      {billing && (
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: "100%", borderRadius: 2, borderColor: "grey.300" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: "text.secondary" }}>
                Billing Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2"><strong>Name:</strong> {billing?.name}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {billing?.phone}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {billing?.email}</Typography>
                <Typography variant="subtitle2" mt={1}>Address:</Typography>
                <Stack pl={2} spacing={0.5}>
                  <Typography variant="body2">{billing?.address?.building}</Typography>
                  <Typography variant="body2">{billing?.address?.locality}, {billing?.address?.city}</Typography>
                  <Typography variant="body2">{billing?.address?.state}, {billing?.address?.country} - {billing?.address?.area_code}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* From Details */}
      {mainDelivery && (
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: "100%", borderRadius: 2, borderColor: "grey.300" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: "text.secondary" }}>
                From Details (Pickup)
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2"><strong>Name:</strong> {mainDelivery?.start?.location?.descriptor?.name}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {mainDelivery?.start?.contact?.phone}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {mainDelivery?.start?.contact?.email}</Typography>
                <Typography variant="subtitle2" mt={1}>Address:</Typography>
                <Stack pl={2} spacing={0.5}>
                  <Typography variant="body2">{mainDelivery?.start?.location?.address?.building}</Typography>
                  <Typography variant="body2">{mainDelivery?.start?.location?.address?.locality}, {mainDelivery?.start?.location?.address?.city}</Typography>
                  <Typography variant="body2">{mainDelivery?.start?.location?.address?.state}, {mainDelivery?.start?.location?.address?.country} - {mainDelivery?.start?.location?.address?.area_code}</Typography>
                </Stack>
                <Typography variant="body2" mt={1}>
                  <strong>Expected Pickup:</strong> {dayjs(mainDelivery?.start?.time?.range?.start).format("DD MMM YYYY, hh:mm A")}
                  {" - "}
                  {dayjs(mainDelivery?.start?.time?.range?.end).format("hh:mm A")}
                </Typography>
                <Typography variant="body2">
                  <strong>Picked On:</strong> {mainDelivery?.start?.time?.timestamp ? dayjs(mainDelivery?.start?.time?.timestamp).format("DD MMM YYYY, hh:mm A") : ""}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* To Details */}
      {mainDelivery && (
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: "100%", borderRadius: 2, borderColor: "grey.300" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: "text.secondary" }}>
                To Details (Drop-off)
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2"><strong>Name:</strong> {mainDelivery?.end?.person?.name}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {mainDelivery?.end?.contact?.phone}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {mainDelivery?.end?.contact?.email}</Typography>
                <Typography variant="subtitle2" mt={1}>Address:</Typography>
                <Stack pl={2} spacing={0.5}>
                  <Typography variant="body2">{mainDelivery?.end?.location?.address?.building}</Typography>
                  <Typography variant="body2">{mainDelivery?.end?.location?.address?.locality}, {mainDelivery?.end?.location?.address?.city}</Typography>
                  <Typography variant="body2">{mainDelivery?.end?.location?.address?.state}, {mainDelivery?.end?.location?.address?.country} - {mainDelivery?.end?.location?.address?.area_code}</Typography>
                </Stack>
                <Typography variant="body2" mt={1}>
                  <strong>Expected Delivery:</strong> {dayjs(mainDelivery?.end?.time?.range?.start).format("DD MMM YYYY, hh:mm A")}
                  {" - "}
                  {dayjs(mainDelivery?.end?.time?.range?.end).format("hh:mm A")}
                </Typography>
                <Typography variant="body2">
                  <strong>Delivered On:</strong> {mainDelivery?.end?.time?.timestamp ? dayjs(mainDelivery?.end?.time?.timestamp).format("DD MMM YYYY, hh:mm A") : ""}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  </Box>
);

export default InvoiceCard;
