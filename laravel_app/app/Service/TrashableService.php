<?php

namespace App\Service;

use Illuminate\Database\Eloquent\Model;

/**
 * Reusable trait for handling soft delete trash operations
 * Eliminates code duplication across different services
 */
trait TrashableService
{
    /**
     * Restore a soft-deleted model by identifier
     *
     * @param string $modelClass Fully qualified model class name
     * @param string $identifier Slug or ID to find the model
     * @param string $identifierField Field to search by (default: 'slug')
     * @return Model
     * @throws \Exception
     */
    public static function restoreModel(string $modelClass, string $identifier, string $identifierField = 'slug'): Model
    {
        try {
            $model = $modelClass::withTrashed()
                ->where($identifierField, $identifier)
                ->firstOrFail();
            
            $model->restore();
            
            return $model;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Permanently delete a soft-deleted model
     *
     * @param string $modelClass Fully qualified model class name
     * @param string $identifier Slug or ID to find the model
     * @param string $identifierField Field to search by (default: 'slug')
     * @return bool
     * @throws \Exception
     */
    public static function forceDeleteModel(string $modelClass, string $identifier, string $identifierField = 'slug'): bool
    {
        try {
            $model = $modelClass::withTrashed()
                ->where($identifierField, $identifier)
                ->firstOrFail();
            
            $model->forceDelete();
            
            return true;
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get a model by identifier including trashed records
     *
     * @param string $modelClass Fully qualified model class name
     * @param string $identifier Slug or ID to find the model
     * @param string $identifierField Field to search by (default: 'slug')
     * @param array $with Relationships to eager load
     * @return Model
     * @throws \Exception
     */
    public static function getModelWithTrashed(string $modelClass, string $identifier, string $identifierField = 'slug', array $with = []): Model
    {
        try {
            $query = $modelClass::withTrashed();
            
            if (!empty($with)) {
                $query->with($with);
            }
            
            return $query->where($identifierField, $identifier)->firstOrFail();
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
