<div
    <?php echo e($attributes
            ->merge([
                'id' => $getId(),
            ], escape: false)
            ->merge($getExtraAttributes(), escape: false)); ?>

>
    <?php echo e($getChildSchema()); ?>

</div>
<?php /**PATH C:\Users\minhz\OneDrive\Documents\Graduation project\FlashTechdoan\vendor\filament\schemas\resources\views/components/grid.blade.php ENDPATH**/ ?>