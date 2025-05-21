'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { UserManagementProvider, useUserManagement } from '@/contexts/UserManagementContext';
import UserForm from '@/features/users/components/UserForm';
import { UserData, UserInput } from '@/core/domain/entities/UserManagement';

function UsersPageContent() {
  const {
    users,
    total,
    loading,
    error,
    searchParams,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    setSearchParams,
  } = useUserManagement();

  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  useEffect(() => {
    getUsers(searchParams);
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchParams({ ...searchParams, query, page: 1 });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setSearchParams({ ...searchParams, page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({
      ...searchParams,
      limit: parseInt(event.target.value, 10),
      page: 1,
    });
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleDelete = (user: UserData) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const handleSubmit = async (data: UserInput) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data);
    } else {
      await createUser(data);
    }
    setOpenForm(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Quản lý người dùng</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm mới
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên, email..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Tên đăng nhập</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Điện thoại</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: 'error.main' }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Tooltip title="Sửa">
                        <IconButton onClick={() => handleEdit(user)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton onClick={() => handleDelete(user)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={(searchParams.page || 1) - 1}
          rowsPerPage={searchParams.limit || 10}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Số dòng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trên ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Paper>

      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        initialData={selectedUser}
        title={selectedUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa người dùng {userToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function UsersPage() {
  return (
    <UserManagementProvider>
      <UsersPageContent />
    </UserManagementProvider>
  );
}