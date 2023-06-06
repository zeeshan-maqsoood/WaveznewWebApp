import React, { useEffect, useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import ApiInstance from '../../pages/api/baseApiIinstance'

// i18n
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import { FormHelperText } from '@material-ui/core'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export default function CategoryCheckbox({ startingIds, categories, updateCategories, categoriesIsValid, setUnsavedChanges = () => { }, service = "" }) {
    const [listingCategories, setListingCategories] = useState([
{
    }
])
    let catList = []

    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : fr

    useEffect(() => {
        let isMounted = true               // note mutable flag
        const callApi = () => {
            ApiInstance().get('vessel/category')
                .then((response) => {
                    const listCat = []
                    if (Array.isArray(response?.data)) {
                        const nonDeletedCategories = response.data?.filter(c => c.status !== "SOFT_DELETE")
                        for (let index = 0; index < nonDeletedCategories.length; index++) {
                            if (service === "RENTAL" && nonDeletedCategories[index].isRental) { listCat.push(nonDeletedCategories[index]) } else if (service === "CHARTER" && nonDeletedCategories[index].isCharter) { listCat.push(nonDeletedCategories[index]) } else if (service === "STAY" && nonDeletedCategories[index].isStay) { listCat.push(nonDeletedCategories[index]) }
                        }
                    }
                    if (isMounted) {
                        setListingCategories(listCat)
                    }
                })
                .catch((e) => {
                    // router.push("/somethingWentWrong");
                })
        }

        service && callApi()

        return () => { isMounted = false } // use cleanup to toggle value, if unmounted
    }, [service])

    useEffect(() => {
        if (startingIds !== [] && listingCategories !== [{}]) {
            const existingCats = []
            // eslint-disable-next-line no-var
            for (var i = 0; i <= startingIds?.length - 1; i++) {
                if (typeof startingIds?.[i] === "string") {
                    existingCats.push(listingCategories.find(cat => cat._id === startingIds?.[i]))
                }
            }
            updateCategories(existingCats)
        }
    }, [listingCategories, startingIds])

    return (
        <Autocomplete
            onChange={(event, value) => {
                catList = []
                value.map((item) => (catList.includes(item) ? "" : catList.push(item)))
                updateCategories(catList)
                setUnsavedChanges()
            }}
            multiple
            value={categories}
            id="checkboxes-listing-categories"
            options={listingCategories}
            disableCloseOnSelect
            getOptionLabel={(option) => option?.name}
            renderOption={(option, { selected }) => (
                <React.Fragment>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        color="primary"
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option?.name}
                </React.Fragment>
            )}
            renderInput={(params) => (
                <>
                    <TextField {...params} variant="outlined" label="" placeholder="" error={!categoriesIsValid} data-testid="category" />
                    <FormHelperText error> {!categoriesIsValid ? t.addListStep1.errorCategory : null} </FormHelperText>
                </>
            )}
        />
    )
}
