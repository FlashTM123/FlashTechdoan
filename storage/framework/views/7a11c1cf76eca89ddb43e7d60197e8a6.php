<div
    <?php echo e($attributes
            ->merge([
                'id' => $getId(),
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)); ?>

>
    <?php echo e($getChildSchema()); ?>

</div>
<?php /**PATH C:\Users\minhz\Documents\Graduation project\FlashTech\vendor\filament\schemas\resources\views/components/grid.blade.php ENDPATH**/ ?>