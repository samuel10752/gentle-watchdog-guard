-- Add location fields to managed_pcs table
ALTER TABLE public.managed_pcs
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION,
ADD COLUMN location_accuracy DOUBLE PRECISION,
ADD COLUMN location_updated_at TIMESTAMP WITH TIME ZONE;

-- Add index for geospatial queries
CREATE INDEX idx_managed_pcs_location ON public.managed_pcs (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.managed_pcs.latitude IS 'GPS latitude coordinate';
COMMENT ON COLUMN public.managed_pcs.longitude IS 'GPS longitude coordinate';
COMMENT ON COLUMN public.managed_pcs.location_accuracy IS 'Location accuracy in meters';
COMMENT ON COLUMN public.managed_pcs.location_updated_at IS 'Timestamp of last location update';