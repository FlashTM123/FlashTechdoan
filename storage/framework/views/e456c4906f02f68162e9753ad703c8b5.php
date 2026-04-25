<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý nhân viên</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <div class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-6 py-8">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-bold">Quản lý nhân viên</h1>
                    <a href="<?php echo e(route('admin.users.create')); ?>" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                        + Thêm nhân viên
                    </a>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-6 py-8">
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-gray-600 text-sm font-medium">Tổng nhân viên</div>
                    <div class="text-3xl font-bold mt-2"><?php echo e(count($users)); ?></div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-gray-600 text-sm font-medium">Admin</div>
                    <div class="text-3xl font-bold mt-2 text-red-600"><?php echo e(count($users->where('role', 'admin'))); ?></div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-gray-600 text-sm font-medium">Moderator</div>
                    <div class="text-3xl font-bold mt-2 text-yellow-600"><?php echo e(count($users->where('role', 'moderator'))); ?></div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-gray-600 text-sm font-medium">Hoạt động</div>
                    <div class="text-3xl font-bold mt-2 text-green-600"><?php echo e(count($users->where('is_active', true))); ?></div>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-100 border-b">
                        <tr>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên nhân viên</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mã nhân viên</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phòng ban</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vai trò</th>
                            <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                            <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__empty_1 = true; $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                        <tr class="border-b hover:bg-gray-50 transition">
                            <td class="px-6 py-4 text-gray-600"><?php echo e($index + 1); ?></td>
                            <td class="px-6 py-4 font-medium text-gray-900"><?php echo e($user->name); ?></td>
                            <td class="px-6 py-4 text-gray-600"><?php echo e($user->email); ?></td>
                            <td class="px-6 py-4 text-gray-600"><?php echo e($user->employee_code); ?></td>
                            <td class="px-6 py-4 text-gray-600"><?php echo e($user->department); ?></td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-white text-xs font-bold inline-block
                                    <?php if($user->role === 'admin'): ?> bg-red-600
                                    <?php elseif($user->role === 'moderator'): ?> bg-yellow-600
                                    <?php else: ?> bg-blue-600
                                    <?php endif; ?>
                                ">
                                    <?php echo e(ucfirst($user->role)); ?>

                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-xs font-bold inline-block
                                    <?php if($user->is_active): ?> bg-green-100 text-green-800
                                    <?php else: ?> bg-red-100 text-red-800
                                    <?php endif; ?>
                                ">
                                    <?php echo e($user->is_active ? '✓ Hoạt động' : '✗ Khóa'); ?>

                                </span>
                            </td>
                            <td class="px-6 py-4 text-center space-x-2">
                                <a href="<?php echo e(route('admin.users.edit', $user->id)); ?>" class="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-xs font-semibold inline-block">
                                    Sửa
                                </a>
                                <form action="<?php echo e(route('admin.users.destroy', $user->id)); ?>" method="POST" class="inline" onsubmit="return confirm('Bạn chắc chắn muốn xóa nhân viên này?');">
                                    <?php echo csrf_field(); ?>
                                    <?php echo method_field('DELETE'); ?>
                                    <button type="submit" class="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-semibold">
                                        Xóa
                                    </button>
                                </form>
                            </td>
                        </tr>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                        <tr>
                            <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                                Không có nhân viên nào
                            </td>
                        </tr>
                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
<?php /**PATH C:\Users\minhz\Documents\Graduation project\FlashTech\resources\views/admin/users/index.blade.php ENDPATH**/ ?>