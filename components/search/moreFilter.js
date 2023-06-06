import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Router from "next/router"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Counter from "../../pages/addList/counter"
import API from "../../pages/api/baseApiIinstance"

// i18n
// eslint-disable-next-line no-duplicate-imports
import { useRouter } from "next/router"
import en from "../../locales/en.js"
import fr from "../../locales/fr.js"
import {Accordion, AccordionDetails, Checkbox, FormControlLabel, FormGroup, withStyles} from "@material-ui/core"
import {green} from "@material-ui/core/colors"
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import {Favorite, FavoriteBorder} from "@material-ui/icons"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles((theme) => ({
  counterText: {
    fontSize: 24,
    width: "100%",
    display: "inline-block"
  }
}))
const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600]
    }
  },
  checked: {}
})((props) => <Checkbox color="default" {...props} />)

const MoreFilter = (props) => {
  const {categories, features, checkedFeatures, checkedCategories, setCheckedCategories, setCheckedFeatures, onSave} = props
  const router = useRouter()
  const { locale } = router
  const t = locale === "en" ? en : fr

  const classes = useStyles()
  const [state, setState] = useState({
    checkedA: false,
    checkedB: false
  })
  // const [categories, setCategories] = useState([]);
  // const [features, setFeatures] = useState([])
  useEffect(() => {
  }, [])

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked })
    }

    const handleFeaturesChange = (event) => {
      setCheckedFeatures({ ...checkedFeatures, [event.target.name]: event.target.checked })
    }

    const handleCategoriesChange = (event) => {
        setCheckedCategories({ ...checkedCategories, [event.target.name]: event.target.checked })
    }

    // useEffect(() => {
    //     console.log(checkedFeatures);
    //     console.log(checkedCategories);
    // }, [checkedFeatures, checkedCategories]);

    return (
        <>
            <Accordion elevation={2} style={{marginTop: "3em"}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h5 style={{fontSize: "16px"}}>{t.editListing.vesselDescription.features}</h5>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <div>
                            {features.map((feature, ind) => (
                                <Grid container key={`${ind  }cont`}>
                                    {features[ind * 3] &&
                                    <Grid item
                                          xs={4}
                                          key={`${ind  }grid`}>
                                        <FormControlLabel
                                            key={`${ind  }contrl`}
                                            control={
                                                <Checkbox
                                                    key={`${ind  }feature`}
                                                    checked={checkedFeatures[features[ind * 3]?._id]}
                                                    onChange={handleFeaturesChange}
                                                    name={features[ind * 3]?._id}
                                                    color="primary"
                                                />
                                            }
                                            label={features[ind * 3]?.feature}
                                        />
                                    </Grid>}
                                    {features[ind * 3 + 1] &&
                                    (
                                        <Grid item
                                              xs={4}
                                              key={`${ind  }grid2`}>
                                            <FormControlLabel
                                                key={`${ind  }control2`}
                                                control={
                                                    <Checkbox
                                                        key={`${ind  }feature2`}
                                                        checked={checkedFeatures[features[ind * 3 + 1]?._id]}
                                                        onChange={handleFeaturesChange}
                                                        name={features[ind * 3 + 1]?._id}
                                                        color="primary"
                                                    />
                                                }
                                                label={features[ind * 3 + 1]?.feature}
                                            />
                                        </Grid>
                                    )}
                                    {features[ind * 3 + 2] &&
                                    (
                                        <Grid item
                                              xs={4}
                                              key={`${ind  }grid3`}>
                                            <FormControlLabel
                                                key={`${ind  }control3`}
                                                control={
                                                    <Checkbox
                                                        key={`${ind  }feature3`}
                                                        checked={checkedFeatures[features[ind * 3 + 2]?._id]}
                                                        onChange={handleFeaturesChange}
                                                        name={features[ind * 3 + 2]?._id}
                                                        color="primary"
                                                    />
                                                }
                                                label={features[ind * 3 + 2]?.feature}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            ))}
                        </div>
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
      {/*<FormGroup>*/}
      {/*    <h3>Features</h3>*/}

      {/*    <div>*/}
      {/*        {features.map((feature, ind) => (*/}
      {/*            <Grid container key={ind + 'cont'}>*/}
      {/*                {features[ind * 3] &&*/}
      {/*                <Grid item*/}
      {/*                      xs={4}*/}
      {/*                      key={ind + 'grid'}>*/}
      {/*                    <FormControlLabel*/}
      {/*                        key={ind + 'contrl'}*/}
      {/*                        control={*/}
      {/*                            <Checkbox*/}
      {/*                                key={ind + 'feature'}*/}
      {/*                                checked={checkedFeatures[features[ind * 3]?._id]}*/}
      {/*                                onChange={handleFeaturesChange}*/}
      {/*                                name={features[ind * 3]?._id}*/}
      {/*                                color="primary"*/}
      {/*                            />*/}
      {/*                        }*/}
      {/*                        label={features[ind * 3]?.feature}*/}
      {/*                    />*/}
      {/*                </Grid>}*/}
      {/*                {features[ind * 3 + 1] &&*/}
      {/*                (*/}
      {/*                    <Grid item*/}
      {/*                          xs={4}*/}
      {/*                          key={ind + 'grid2'}>*/}
      {/*                        <FormControlLabel*/}
      {/*                            key={ind + 'control2'}*/}
      {/*                            control={*/}
      {/*                                <Checkbox*/}
      {/*                                    key={ind + 'feature2'}*/}
      {/*                                    checked={checkedFeatures[features[ind * 3 + 1]?._id]}*/}
      {/*                                    onChange={handleFeaturesChange}*/}
      {/*                                    name={features[ind * 3 + 1]?._id}*/}
      {/*                                    color="primary"*/}
      {/*                                />*/}
      {/*                            }*/}
      {/*                            label={features[ind * 3 + 1]?.feature}*/}
      {/*                        />*/}
      {/*                    </Grid>*/}
      {/*                )}*/}
      {/*                {features[ind * 3 + 2] &&*/}
      {/*                (*/}
      {/*                    <Grid item*/}
      {/*                          xs={4}*/}
      {/*                          key={ind + 'grid3'}>*/}
      {/*                        <FormControlLabel*/}
      {/*                            key={ind + 'control3'}*/}
      {/*                            control={*/}
      {/*                                <Checkbox*/}
      {/*                                    key={ind + 'feature3'}*/}
      {/*                                    checked={checkedFeatures[features[ind * 3 + 2]?._id]}*/}
      {/*                                    onChange={handleFeaturesChange}*/}
      {/*                                    name={features[ind * 3 + 2]?._id}*/}
      {/*                                    color="primary"*/}
      {/*                                />*/}
      {/*                            }*/}
      {/*                            label={features[ind * 3 + 2]?.feature}*/}
      {/*                        />*/}
      {/*                    </Grid>*/}
      {/*                )}*/}
      {/*            </Grid>*/}
      {/*        ))}*/}
      {/*    </div>*/}
      {/*</FormGroup>*/}
            <Accordion elevation={2} style={{marginBottom: "2em"}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h5 style={{fontSize: "16px"}}>{t.categories}</h5>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        <div>
                            {categories.map((category, ind) => (
                                <Grid container key={`${ind  }conta`}>
                                    {categories[ind * 3] &&
                                    <Grid item
                                          xs={4}
                                          key={`${ind  }grido`}>
                                        <FormControlLabel
                                            key={`${ind  }contrlo`}
                                            control={
                                                <Checkbox
                                                    key={`${ind  }feature`}
                                                    checked={checkedCategories[categories[ind * 3]?._id]}
                                                    onChange={handleCategoriesChange}
                                                    name={categories[ind * 3]?._id}
                                                    color="primary"
                                                />
                                            }
                                            label={categories[ind * 3]?.name}
                                        />
                                    </Grid>}
                                    {categories[ind * 3 + 1] &&
                                    (
                                        <Grid item
                                              xs={4}
                                              key={`${ind  }grid2o`}>
                                            <FormControlLabel
                                                key={`${ind  }control2o`}
                                                control={
                                                    <Checkbox
                                                        key={`${ind  }feature2o`}
                                                        checked={checkedCategories[categories[ind * 3 + 1]?._id]}
                                                        onChange={handleCategoriesChange}
                                                        name={categories[ind * 3 + 1]?._id}
                                                        color="primary"
                                                    />
                                                }
                                                label={categories[ind * 3 + 1]?.name}
                                            />
                                        </Grid>
                                    )}
                                    {categories[ind * 3 + 2] &&
                                    (
                                        <Grid item
                                              xs={4}
                                              key={`${ind  }grid3o`}>
                                            <FormControlLabel
                                                key={`${ind  }control3o`}
                                                control={
                                                    <Checkbox
                                                        key={`${ind  }feature3o`}
                                                        checked={checkedCategories[categories[ind * 3 + 2]?._id]}
                                                        onChange={handleCategoriesChange}
                                                        name={categories[ind * 3 + 2]?._id}
                                                        color="primary"
                                                    />
                                                }
                                                label={categories[ind * 3 + 2]?.name}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            ))}
                        </div>
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
            <Grid container >
                <Grid item xs={4} sm={7} />
                <Grid item xs={4} sm={2}>
                    <Button
                        onClick={() => { onSave(true) }}
                        variant="outlined"
                        color="primary"
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}
                    >
                        <Typography variant="body2" color="primary">
                            {t.search.filter.clear}
                        </Typography>
                    </Button>
                </Grid>
                <Grid item xs={4} sm={2}>
                    <Button
                        onClick={() => { onSave() }}
                        variant="contained"
                        color="primary"
                        style={{
                            fontWeight: "400",
                            textTransform: "capitalize",
                            fontSize: "18px",
                            maxWidth: "150px"
                        }}
                    >
                        <Typography variant="body2">{t.search.filter.save}</Typography>
                    </Button>
                </Grid>
            </Grid>
    </>
  )
}
export default MoreFilter
