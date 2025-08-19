import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from "react-router-dom";
import useStyles from './style';
import clsx from 'clsx';
import { getCall } from '../../../Api/axios';

import StoreDetails from './StoreDetails';

// Images
import Fashion1 from '../../../Assets/Images/Category/Fashion1.png';
import Fashion2 from '../../../Assets/Images/Category/Fashion2.png';
import Electronics1 from '../../../Assets/Images/Category/Electronics1.png';
import Electronics2 from '../../../Assets/Images/Category/Electronics2.png';
import Electronics3 from '../../../Assets/Images/Category/Electronics3.png';
import Electronics4 from '../../../Assets/Images/Category/Electronics4.png';
import Grocery from "../../../Assets/Images/Category/Food.png";
import Health1 from '../../../Assets/Images/Category/Health1.png';
import Health2 from '../../../Assets/Images/Category/Health2.png';
import Home1 from '../../../Assets/Images/Category/Home1.png';
import Home2 from '../../../Assets/Images/Category/Home2.png';
import Agriculture from '../../../Assets/Images/Category/Agriculture.png';

const MallGrid = () => {
    const classes = useStyles();
    const { id } = useParams(); // merchantId from URL

    const [storeAvailability, setStoreAvailability] = useState({});
    const [storeList, setStoreList] = useState([]);
    const [storeListFetched, setStoreListFetched] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStoreData, setSelectedStoreData] = useState({ title: '', isAvailable: false, storeId: null });

    const categories = [
        {
            key: "Grocery",
            title: "Grocery",
            catId:"RET10",
            images: [Grocery],
            className: classes.groceryCategory,
        },
        {
            key: "Fashion",
            title: "Fashion",
            catId:"RET12",
            images: [Fashion1, Fashion2],
            className: classes.fashionCategory,
        },
        {
            key: "Electronics",
            title: "Electronics",
            catId:"RET14",
            images: [Electronics1, Electronics2, Electronics3, Electronics4],
            className: classes.electronicsCategory,
        },
        {
            key: "Health & Wellness",
            title: "Health & Wellness",
            catId:"RET15",
            images: [Health1, Health2],
            className: classes.healthCategory,
        },
        {
            key: "Home & Kitchen",
            title: "Home & Kitchen",
            catId:"RET16",
            images: [Home1, Home2],
            className: classes.homeCategory,
        },
        {
            key: "Appliances",
            title: "Appliances",
            catId:"RET18",
            images: [Agriculture],
            className: classes.agricultureCategory,
        }
    ];

    const categoryLabelMap = {
        RET10: "Grocery",
        RET12: "Fashion",
        RET14: "Electronics",
        RET15: "Appliances",
        RET16: "Home & Kitchen",
        RET18: "Health & Wellness",
    };

    const getStoreList = async () => {
        const url = `/api/v1/seller/merchantId/${id}/store/list`;
        const result = await getCall(url);
        setStoreList(result.data);

        const availability = {};
        result.data.forEach(item => {
            const label = categoryLabelMap[item.category];
            if (label) {
                availability[label] = {
                    status: item.status,
                    storeId: item.storeId
                };
            }
        });

        setStoreAvailability(availability);
        setStoreListFetched(true);
    };

    useEffect(() => {
        if (storeList.length === 0 && !storeListFetched) {
            getStoreList();
        }
    }, [storeList, storeListFetched]);

    const handleClick = (title, catId, isAvailable) => {
        const storeId = storeAvailability[title]?.storeId || null;
        setSelectedStoreData({ title, catId, isAvailable, storeId });
        setOpenDialog(true);
    };

    return (
        <>
            <Box className={classes.homeContainer}>
                <Grid container spacing={3}>
                    {categories.map(({ key, title, catId, images, className }) => {
                        const isAvailable = storeAvailability[key]?.status === "Yes";

                        return (
                            <Grid item xs={12} sm={6} md={4} key={title}>
                                <Box className={classes.squareWrapper}>
                                    <Card
                                        className={clsx(
                                            classes.cardBase,
                                            className,
                                            isAvailable && classes.activeCategoryCard
                                        )}
                                        onClick={() => handleClick(title, catId, isAvailable)}
                                    >
                                        <Box className={classes.imageContainer}>
                                            {images.map((src, idx) => (
                                                <img key={idx} src={src} alt={`${title} ${idx + 1}`} />
                                            ))}
                                        </Box>

                                        <Typography className={clsx(
                                            classes.categoryTitle,
                                            key === "Grocery" && classes.groceryTitleHighlight
                                        )}>
                                            {title}
                                        </Typography>

                                        <Button
                                            className={isAvailable ? classes.updateButton : classes.addButton}
                                            startIcon={isAvailable ? <EditIcon /> : <AddCircleOutlineIcon />}
                                        >
                                            {isAvailable ? "Update Store" : "Add Store"}
                                        </Button>
                                    </Card>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Store Details Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
                <DialogTitle>
                    {selectedStoreData.isAvailable ? "Update" : "Add"} Store - {selectedStoreData.title}
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenDialog(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <StoreDetails
                        storeId={selectedStoreData.storeId}
                        selectedCategory={selectedStoreData.catId}
                        isFromUserListing={false}
                        onClose={() => setOpenDialog(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MallGrid;
