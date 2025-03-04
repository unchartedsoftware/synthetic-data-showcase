use super::{
    data_aggregator::AggregatedCount, records_analysis_data::RecordsAnalysis,
    value_combination::ValueCombination,
};
use fnv::{FnvHashMap, FnvHashSet};
use std::sync::Arc;

use crate::data_block::record::DataBlockRecord;

/// Set of records where the key is the record index starting in 0
pub type RecordsSet = FnvHashSet<usize>;

/// Maps a value combination to its aggregated count
pub type AggregatesCountMap = FnvHashMap<ValueCombination, AggregatedCount>;

/// Maps a value combination represented as a string to its aggregated count
pub type AggregatesCountStringMap = FnvHashMap<String, AggregatedCount>;

/// Maps a length (1,2,3... up to reporting length) to a determined count
pub type AggregatedCountByLenMap = FnvHashMap<usize, usize>;

/// Maps a length (1,2,3... up to reporting length) to a record set
pub type RecordsByLenMap = FnvHashMap<usize, RecordsSet>;

/// A vector of sensitivities for each record (the vector index is the record index)
pub type RecordsSensitivity = Vec<usize>;

/// Slice of RecordsSensitivity
pub type RecordsSensitivitySlice = [usize];

/// Vector of tuples:
/// (index of the original record, reference to the original record)
pub type EnumeratedDataBlockRecords = Vec<(usize, Arc<DataBlockRecord>)>;

/// Map of records analysis grouped by combination len
pub type RecordsAnalysisByLenMap = FnvHashMap<usize, RecordsAnalysis>;
