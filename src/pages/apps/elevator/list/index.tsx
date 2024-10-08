// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteElevator } from 'src/store/apps/elevator'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { ElevatorType } from 'src/types/apps/elevatorTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/elevator/list/TableHeader'
import AddElevatorDrawer from 'src/views/apps/elevator/list/AddElevatorDrawer'

// ** Vars
interface CellType {
  row: ElevatorType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteElevator(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/elevator/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      const { name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ color: "#000", display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{name}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'customer',
    headerName: 'Customer',
    renderCell: ({ row }: CellType) => {
      const { customer } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ color: "#000", display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{customer}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'uniqueId',
    headerName: 'Unique Id',
    renderCell: ({ row }: CellType) => {
      const { uniqueId } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ color: "#000", display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{uniqueId}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'project',
    headerName: 'Project',
    renderCell: ({ row }: CellType) => {
      const { project } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ color: "#000", display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{project}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]

const elevatorList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [addElevatorOpen, setAddElevatorOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.elevator)

  useEffect(() => {
    //("fetchData call in elevator");
    dispatch(
      fetchData({
        role,
        status,
        q: value,
        currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  //("before useCallback");

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  //("before setAddElevatorOpen");

  const toggleAddElevatorDrawer = () => setAddElevatorOpen(!addElevatorOpen)

  //("trying to return sth");

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddElevatorDrawer} />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      <AddElevatorDrawer open={addElevatorOpen} toggle={toggleAddElevatorDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default elevatorList
