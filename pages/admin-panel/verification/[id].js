import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Session from '../../../sessionService'
import React, { useEffect, useState } from 'react'
import API from '../../api/baseApiIinstance'
import NavBar from '../../../components/admin-panel/navBar'
import Grid from '@material-ui/core/Grid'
import {
  Backdrop,
  CircularProgress,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import moment from 'moment'
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import CloseIcon from '@material-ui/icons/Close'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import ClearIcon from '@material-ui/icons/Clear'
import MaximizeIcon from '@material-ui/icons/Maximize'
import CheckIcon from '@material-ui/icons/Check'
import theme from '../../../src/theme'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    fontFamily: 'Roboto',
    color: theme.palette.title.matterhorn
  },
  paper: {
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
    width: 'inherit'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.background.default
  },
  profileInitials: {
    fontSize: '40px',
    border: '1px none red',
    borderRadius: '50%',
    width: '6rem',
    height: '6rem',
    textAlign: 'center',
    textTransform: 'capitalize',
    paddingTop: '1.4rem',
    backgroundColor: theme.palette.wavezHome.backgroundColorSearch,
    color: theme.palette.text.darkCerulean,
    fontWeight: '100'
  },
  documentName: {
    fontWeight: 500,
    fontSize: 18,
    width: 400,
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      paddingTop: 15,
      width: '80%',
      paddingRight: '5%'
    }
  },
  detailsWeight: {
    fontWeight: '500',
    color: theme.palette.title.matterhorn,
    paddingLeft: '4em !important'
  },
  profileImage: {
    borderRadius: '50%',
    height: '6rem',
    width: '6rem'
  },
  hideInput: {
    width: '0.1px',
    height: '0.1px',
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: '-1'
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  inputRoot: {
    backgroundColor: `${theme.palette.background.default} !important`
  }
}))

function VesselById() {
  const classes = useStyles()
  const router = useRouter()
  const token = Session.getToken('Wavetoken')
  const [loading, setLoading] = useState(false)
  const [rejectionDialog, setRejectionDialog] = useState(false)
  const [rejReason, setRejectionReason] = useState('')
  const [vesselDetails, setVesselDetails] = useState({})
  const [notificationData, setNotificationData] = useState({})
  const [currDoc, setCurrDoc] = useState({})
  const [identityDetails, setIdentityDetails] = useState({})
  const [vesselDocuments, setVesselDocuments] = useState([])

  const { id } = router.query

  useEffect(() => {
    console.log(id)
    if (id) {
      getVesselDetailsById()
      getVesselDocumentsById()
    }
  }, [id])

  const getVesselDetailsById = (notification) => {
    // if (router.asPath !== router.route) {
    if (id) {
      setLoading(true)
      API()
        .get(`/vessel/guest/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/json'
          }
        })
        .then((response) => {
          console.log('response is ', response)
          if ((response.status = 200)) {
            setVesselDetails(response.data)
            setLoading(false)
            getIdentityDocumentsById(response.data.userId._id)
            getNotification(response.data.userId._id)
            if (notification) {
              updateNotification({
                user: response.data.userId._id,
                listings: notificationData ? notificationData.listings + 1 : 1
              })
            }
          }
        })
        .catch((e) => {
          console.log('get user listings error: ', e)
        })
      // }
    }
  }

  const getIdentityDocumentsById = (id) => {
    console.log('id?.toString()', id?.toString())
    if (id) {
      setLoading(true)
      API()
        .get(`/docv/getVRecordByUserId/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/json'
          }
        })
        .then((response) => {
          console.log('response is ', response)
          if ((response.status = 200)) {
            setIdentityDetails(response.data)
            setLoading(false)
          }
        })
        .catch((e) => {
          console.log('get user listings error: ', e)
        })
    }
  }

  const getVesselDocumentsById = (status) => {
    if (id) {
      setLoading(true)
      API()
        .get(`/vessel/admin/document/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/json'
          }
        })
        .then((response) => {
          console.log('response is ', response)
          if ((response.status = 200)) {
            setVesselDocuments(response.data)
            response.status
            setLoading(false)
            if (status === 'REJECTED') {
              if (vesselDetails.vesselStatus !== 'REJECTED') {
                updateVessel(
                  {
                    vesselStatus: 'REJECTED'
                  },
                  true
                )
              }
            } else if (status === 'CHECK_REJECTED') {
              let checkForAnyFault = false
              response.data.forEach((doc, index) => {
                if (doc.fileType !== 'ProofOfId') {
                  if (
                    (vesselDetails.allDocumentsCat.some(
                      (o) => o.shortForm === doc.fileType
                    ) &&
                      vesselDetails.allDocumentsCat[index].isRequired &&
                      doc.status !== 'APPROVED') ||
                    identityDetails?.Record?.RecordStatus !== 'match'
                  ) {
                    checkForAnyFault = true
                  }
                }
              })
              if (!checkForAnyFault) {
                updateVessel({
                  vesselStatus: 'UNPUBLISHED'
                })
              }
            }
          }
        })
        .catch((e) => {
          console.log('get user listings error: ', e)
        })
    }
  }

  const updateVessel = (updatedListing, notification) => {
    setLoading(true)
    API()
      .put(`/vessel/${vesselDetails._id}`, updatedListing, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log('response is ', response)
        if ((response.status = 200)) {
          setLoading(false)
          if (notification) {
            getVesselDetailsById(notification)
          }
        }
      })
      .catch((e) => {
        window.alert(e)
      })
  }

  const getNotification = (userId) => {
    console.log('GETTTT')
    setLoading(true)
    API()
      .get(`/notifications/${userId}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log('response is ', response)
        if ((response.status = 200)) {
          setNotificationData(response.data)
          setLoading(false)
        }
      })
      .catch((e) => {
        window.alert(e)
      })
  }

  const updateNotification = (data) => {
    setLoading(true)
    API()
      .post(`/notifications/${vesselDetails.userId._id}`, data, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log('response is ', response)
        if ((response.status = 200)) {
          setLoading(false)
        }
      })
      .catch((e) => {
        window.alert(e)
      })
  }

  const onClickApprove = (doc) => {
    console.log(doc)
    API()
      .put(
        `/vessel/admin/document/${doc._id}`,
        {
          isVerified: true,
          isRejected: false,
          rejectionReason: '',
          status: 'APPROVED'
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/json'
          }
        }
      )
      .then((response) => {
        console.log('response is ', response)
        if ((response.status = 200)) {
          setLoading(false)
          getVesselDocumentsById('CHECK_REJECTED')
        }
      })
      .catch((e) => {
        console.log('get user listings error: ', e)
      })
  }

  const onClickReject = (doc) => {
    console.log('Reject', doc)
    API()
      .put(
        `/vessel/admin/document/${doc._id}`,
        {
          isVerified: false,
          isRejected: true,
          rejectionReason: rejReason,
          status: 'REJECTION'
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/json'
          }
        }
      )
      .then((response) => {
        console.log('response is ', response)
        if ((response.status = 200)) {
          getVesselDocumentsById('REJECTED')
          onClickRejectionDialog(false)
          setLoading(false)
        }
      })
      .catch((e) => {
        console.log('get user listings error: ', e)
      })
  }

  const onClickRejectionDialog = (bool, doc) => {
    setRejectionDialog(bool)
    setCurrDoc(doc)
    if (!bool) {
      setRejectionDialog(false)
      setRejectionReason('')
      setCurrDoc({})
    }
  }

  const handleCloseRej = (doc) => {
    setRejectionDialog(false)
    setRejectionReason('')
    setCurrDoc({})
  }

  const onClickBack = () => {
    router.push('/admin-panel/verification')
  }

  return (
    <>
      <NavBar />
      <div className={classes.root}>
        <Grid
          style={{
            marginRight: 'auto',
            marginLeft: '16rem',
            marginTop: '8%',
            width: '90%',
            justifyContent: 'center'
          }}
          container
          spacing={3}
        >
          <Paper className={classes.paper}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid style={{ display: 'flex' }} item xs={3}>
                  <ArrowBackIcon
                    onClick={onClickBack}
                    style={{ fontSize: '2rem', cursor: 'pointer' }}
                  />
                  <Typography
                    style={{ marginLeft: '15px', fontWeight: '500' }}
                    variant="h5"
                    gutterBottom
                  >
                    {vesselDetails.title}
                  </Typography>
                </Grid>
                <Grid style={{ textAlign: 'right' }} item xs={9}></Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid style={{ display: 'flex' }} item xs={2}>
                  <Typography gutterBottom>Listing Title</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography gutterBottom>Service</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography gutterBottom>Owner</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography gutterBottom>Email</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography gutterBottom>Location</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography gutterBottom>Updated Date</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid style={{ display: 'flex' }} item xs={2}>
                  <Typography style={{ fontWeight: '500' }} gutterBottom>
                    {vesselDetails?.title ? vesselDetails?.title : ''}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography style={{ fontWeight: '500' }} gutterBottom>
                    {vesselDetails?.vesselType
                      ? vesselDetails?.vesselType.toUpperCase()
                      : ''}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography style={{ fontWeight: '500' }} gutterBottom>
                    {vesselDetails?.userId?.firstName}{' '}
                    {vesselDetails?.userId?.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography style={{ fontWeight: '500' }} gutterBottom>
                    {vesselDetails?.userId?.email}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography style={{ fontWeight: '500' }} gutterBottom>
                    {vesselDetails?.vesselAddress &&
                    vesselDetails?.vesselAddress?.city
                      ? vesselDetails?.vesselAddress?.city
                      : ''}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography style={{ fontWeight: '500' }} gutterBottom>
                    {vesselDetails?.updatedAt
                      ? moment(vesselDetails?.updatedAt).format('MM/DD/YYYY')
                      : ''}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {vesselDetails?.allDocumentsCat?.map((doc) => (
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  marginTop: '2rem',
                  marginBottom: '2rem'
                }}
              >
                {(doc?.shortForm === 'ProofOfId'
                  ? identityDetails?.Record?.RecordStatus === 'nomatch'
                  : doc?.shortForm !== 'SerialNumber' &&
                    vesselDocuments?.find(
                      (obj) => obj.fileType === doc.shortForm
                    )?.status === 'REJECTION') && (
                  <div
                    style={{ width: 'auto' }}
                    className={classes.documentName}
                  >
                    <Tooltip
                      title={
                        vesselDocuments?.find(
                          (obj) => obj.fileType === doc.shortForm
                        )?.rejectionReason
                      }
                      aria-label={
                        vesselDocuments?.find(
                          (obj) => obj.fileType === doc.shortForm
                        )?.rejectionReason
                      }
                    >
                      <ClearIcon
                        style={{
                          fontSize: '2rem',
                          color: theme.palette.error.main
                        }}
                      />
                    </Tooltip>
                  </div>
                )}

                {doc?.shortForm === 'SerialNumber' && (
                  <div
                    style={{ width: '2rem' }}
                    className={classes.documentName}
                  ></div>
                )}

                {(doc?.shortForm === 'ProofOfId'
                  ? identityDetails.success === false
                  : doc?.shortForm !== 'SerialNumber' &&
                    vesselDocuments?.find(
                      (obj) => obj.fileType === doc.shortForm
                    )?.status !== 'REJECTION' &&
                    vesselDocuments?.find(
                      (obj) => obj.fileType === doc.shortForm
                    )?.status !== 'APPROVED') && (
                  <div
                    style={{ width: 'auto' }}
                    className={classes.documentName}
                  >
                    <MaximizeIcon
                      style={{
                        fontSize: '2rem',
                        color: theme.palette.background.orange
                      }}
                    />
                  </div>
                )}

                {(doc?.shortForm === 'ProofOfId'
                  ? identityDetails?.Record?.RecordStatus === 'match'
                  : doc?.shortForm !== 'SerialNumber' &&
                    vesselDocuments?.find(
                      (obj) => obj.fileType === doc.shortForm
                    )?.status === 'APPROVED') && (
                  <div
                    style={{ width: 'auto' }}
                    className={classes.documentName}
                  >
                    <CheckIcon
                      style={{
                        fontSize: '2rem',
                        color: theme.palette.background.green
                      }}
                    />
                  </div>
                )}

                <div className={classes.documentName}>
                  {doc.name}
                  <span
                    style={{
                      display: !doc.isRequired && 'none',
                      color: theme.palette.error.main
                    }}
                  >
                    *
                  </span>
                </div>

                {doc?.shortForm === 'ProofOfId' &&
                  identityDetails?.documentFrontImage && (
                    <Button
                      style={{ alignSelf: 'center', marginRight: '3rem' }}
                      variant="contained"
                      color="primary"
                      href={identityDetails?.documentFrontImage}
                    >
                      Front Image Document
                    </Button>
                  )}

                {doc?.shortForm === 'ProofOfId' &&
                  identityDetails?.documentBackImage && (
                    <Button
                      style={{ alignSelf: 'center', marginRight: '3rem' }}
                      variant="contained"
                      color="primary"
                      href={identityDetails?.documentBackImage}
                    >
                      Back Image Document
                    </Button>
                  )}

                {doc?.shortForm === 'ProofOfId' &&
                  identityDetails?.livePhoto && (
                    <Button
                      style={{ alignSelf: 'center', marginRight: '3rem' }}
                      variant="contained"
                      color="primary"
                      href={identityDetails?.livePhoto}
                    >
                      Face Image
                    </Button>
                  )}

                {vesselDocuments?.find((obj) => obj.fileType === doc.shortForm)
                  ?.fileURL !== '' &&
                  vesselDocuments?.find((obj) => obj.fileType === doc.shortForm)
                    ?.fileURL && (
                    <Button
                      style={{
                        alignSelf: 'center',
                        marginRight: '3rem',
                        height: 36
                      }}
                      variant="contained"
                      color="primary"
                      href={
                        vesselDocuments?.find(
                          (obj) => obj.fileType === doc.shortForm
                        )?.fileURL
                      }
                    >
                      Document
                    </Button>
                  )}

                {doc?.shortForm === 'SerialNumber'
                  ? vesselDetails?.serialNumber
                  : ''}

                {doc?.shortForm !== 'SerialNumber' &&
                doc?.shortForm !== 'ProofOfId' &&
                vesselDocuments?.find((obj) => obj.fileType === doc.shortForm)
                  ?.fileURL !== '' &&
                vesselDocuments?.find((obj) => obj.fileType === doc.shortForm)
                  ?.fileURL ? (
                  <>
                    <Button
                      style={{
                        backgroundColor: theme.palette.background.eucalyptus,
                        alignSelf: 'center',
                        height: 36,
                        marginRight: '2rem'
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        onClickApprove(
                          vesselDocuments?.find(
                            (obj) => obj.fileType === doc.shortForm
                          )
                        )
                      }}
                    >
                      Approve
                    </Button>

                    <Button
                      style={{
                        alignSelf: 'center',
                        color: theme.palette.background.roman,
                        height: 36,
                        borderColor: theme.palette.background.roman
                      }}
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        onClickRejectionDialog(
                          true,
                          vesselDocuments?.find(
                            (obj) => obj.fileType === doc.shortForm
                          )
                        )
                      }}
                    >
                      Reject
                    </Button>
                  </>
                ) : doc?.shortForm === 'SerialNumber' ||
                  doc?.shortForm === 'ProofOfId' ? (
                  ''
                ) : (
                  'No Document was Uploaded'
                )}
              </Grid>
            ))}
            {rejectionDialog && (
              <div>
                <form
                  method="post"
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                >
                  <Dialog
                    open={rejectionDialog}
                    onClose={() => {
                      onClickRejectionDialog(false)
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <div style={{ padding: '2rem' }}>
                      <CloseIcon
                        onClick={() => {
                          onClickRejectionDialog(false)
                        }}
                        style={{
                          fontSize: '2rem',
                          cursor: 'pointer',
                          float: 'right'
                        }}
                      />
                      <DialogTitle
                        style={{ textAlign: 'center' }}
                        id="alert-dialog-title"
                      >
                        {'Document Rejection Reason'}
                      </DialogTitle>
                      <hr
                        style={{
                          width: 50,
                          backgroundColor: theme.palette.buttonPrimary.main,
                          height: 5,
                          marginTop: '-11px'
                        }}
                      ></hr>
                      <DialogContent style={{ width: '450px' }}>
                        <div style={{ fontSize: '18px', lineHeight: '2' }}>
                          <p style={{ fontWeight: '400' }}>
                            <Grid container item xs={12}>
                              <Grid
                                style={{ marginBottom: '2rem' }}
                                container
                                item
                                xs={12}
                              >
                                <Grid
                                  style={{
                                    textAlign: 'left',
                                    alignSelf: 'center'
                                  }}
                                  item
                                  xs={2}
                                >
                                  <Typography
                                    component={'span'}
                                    style={{
                                      marginLeft: 'auto',
                                      fontWeight: '500',
                                      fontSize: '1.1rem'
                                    }}
                                    variant="h6"
                                    gutterBottom
                                  >
                                    Reason
                                  </Typography>
                                </Grid>
                                <Grid
                                  style={{ textAlign: 'left' }}
                                  item
                                  xs={10}
                                >
                                  <TextField
                                    style={{
                                      width: '100%',
                                      maxWidth: '100%',
                                      minWidth: '100%',
                                      maxHeight: '300px',
                                      overflow: 'auto'
                                    }}
                                    id="outlined-basic"
                                    multiline
                                    inputProps={{
                                      maxLength: 500,
                                      'data-testid': 'descriptionTextField'
                                    }}
                                    variant="outlined"
                                    value={rejReason}
                                    onChange={(event, value) => {
                                      event?.target?.value
                                        ? setRejectionReason(event.target.value)
                                        : setRejectionReason('')
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </p>
                          <div
                            style={{
                              marginTop: '2.6em',
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-evenly'
                            }}
                          ></div>
                        </div>
                      </DialogContent>
                      <DialogActions style={{ justifyContent: 'center' }}>
                        <Button
                          onClick={() => {
                            onClickReject(currDoc)
                          }}
                          style={{
                            color: theme.palette.background.default,
                            backgroundColor: theme.palette.background.roman,
                            alignSelf: 'center',
                            height: 36,
                            marginRight: '2rem'
                          }}
                          variant="contained"
                        >
                          Reject
                        </Button>
                        <Button
                          onClick={() => {
                            onClickRejectionDialog(false)
                          }}
                          style={{
                            color: '#99BAFA',
                            height: 36,
                            borderColor: '#99BAFA'
                          }}
                        >
                          Cancel
                        </Button>
                      </DialogActions>
                    </div>
                  </Dialog>
                </form>
              </div>
            )}
          </Paper>
        </Grid>
      </div>
      <div className={classes.root}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  )
}

export default VesselById
